import { getAuthUser } from '../auth/session.js';

const PREFIX = 'shopmall_orders';

function storageKey() {
  const u = getAuthUser();
  const id = u?.id;
  return id ? `${PREFIX}_${id}` : PREFIX;
}

export function getRecentOrders() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setRecentOrders(orders) {
  localStorage.setItem(storageKey(), JSON.stringify(orders));
}

export function addRecentOrder({
  lines = [],
  subtotal = 0,
  couponDiscount = 0,
  pointDiscount = 0,
  earnedPoints = 0,
  shipping = 0,
  finalAmount = 0,
} = {}) {
  if (!Array.isArray(lines) || lines.length === 0) return null;

  const now = new Date();
  const order = {
    id: `O-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getTime()).slice(-5)}`,
    createdAt: now.toISOString(),
    status: '결제완료',
    lines: lines.map((line) => ({
      productId: String(line.productId),
      name: line.name,
      option: line.option || '',
      image: line.image || '',
      quantity: Number(line.quantity) || 1,
      price: Number(line.price) || 0,
    })),
    subtotal,
    couponDiscount,
    pointDiscount,
    earnedPoints,
    shipping,
    finalAmount,
  };

  const next = [order, ...getRecentOrders()].slice(0, 20);
  setRecentOrders(next);
  return order;
}
