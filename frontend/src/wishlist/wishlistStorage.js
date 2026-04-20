import { getAuthUser } from '../auth/session.js';

const PREFIX = 'shopmall_wishlist';

function storageKey() {
  const u = getAuthUser();
  const id = u?.id;
  return id ? `${PREFIX}_${id}` : PREFIX;
}

/** @returns {object[]} */
export function getWishlist() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** @param {object[]} items */
export function setWishlist(items) {
  localStorage.setItem(storageKey(), JSON.stringify(items));
}

/** @param {object} product API 상품 문서 형태 @returns {boolean} 새로 추가했으면 true */
export function addToWishlist(product) {
  if (!product?._id) return false;
  const list = getWishlist();
  const id = String(product._id);
  if (list.some((p) => String(p._id) === id)) return false;
  list.push({ ...product });
  setWishlist(list);
  return true;
}

export function removeFromWishlist(productId) {
  const id = String(productId);
  const list = getWishlist().filter((p) => String(p._id) !== id);
  setWishlist(list);
}
