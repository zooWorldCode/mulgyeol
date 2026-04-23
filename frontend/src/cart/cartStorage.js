import { getAuthUser } from '../auth/session.js';
import { resolveCategoryListImages } from '../utils/productNormalize.js';

const PREFIX = 'shopmall_cart';

function storageKey() {
  const u = getAuthUser();
  const id = u?.id;
  return id ? `${PREFIX}_${id}` : PREFIX;
}

/**
 * @typedef {object} CartLine
 * @property {string} productId
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 * @property {string} [option]
 */

/** @returns {CartLine[]} */
export function getCartLines() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function emitCartUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('shopmall-cart-updated'));
  }
}

function resolveCartThumb(product) {
  const listImage = resolveCategoryListImages(product.category, product);
  return (
    listImage.imageSrc ||
    (Array.isArray(product.images) && product.images.find(Boolean)) ||
    product.image ||
    ''
  );
}

/** @param {CartLine[]} lines */
export function setCartLines(lines) {
  localStorage.setItem(storageKey(), JSON.stringify(lines));
  emitCartUpdated();
}

export function clearCartLines() {
  localStorage.removeItem(storageKey());
  emitCartUpdated();
}

export function removeCartLine(productId, option = '') {
  const id = String(productId);
  const opt = option || '';
  const next = getCartLines().filter(
    (l) => !(l.productId === id && (l.option ?? '') === opt)
  );
  setCartLines(next);
}

/** @param {number} quantity 최소 1로 보정 */
export function updateCartLineQuantity(productId, option, quantity) {
  const id = String(productId);
  const opt = option || '';
  const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
  const lines = getCartLines();
  const idx = lines.findIndex(
    (l) => l.productId === id && (l.option ?? '') === opt
  );
  if (idx < 0) return;
  lines[idx].quantity = qty;
  setCartLines(lines);
}

/**
 * 동일 productId + option 조합이 이미 있으면 추가하지 않음.
 * @returns {boolean} 새 줄을 넣었으면 true, 이미 있으면 false
 */
export function addToCart(product, qty = 1, option = '') {
  if (!product?._id) return false;
  const lines = getCartLines();
  const productId = String(product._id);
  const opt = option || '';
  const idx = lines.findIndex(
    (l) => l.productId === productId && (l.option ?? '') === opt
  );
  const thumb = resolveCartThumb(product);

  if (idx >= 0) {
    if (!lines[idx].image && thumb) {
      lines[idx].image = thumb;
      setCartLines(lines);
    }
    return false;
  }

  lines.push({
    productId,
    name: product.name,
    price: Number(product.price),
    image: thumb,
    quantity: qty,
    option: opt,
  });
  setCartLines(lines);
  return true;
}
