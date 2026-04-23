const GUEST_ID_KEY = 'couponGuestId';

export function getCouponGuestId() {
  const existing = localStorage.getItem(GUEST_ID_KEY);
  if (existing) {
    return existing;
  }

  const guestId =
    crypto?.randomUUID?.() ||
    `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(GUEST_ID_KEY, guestId);
  return guestId;
}

export function pickRewardType() {
  const rewards = ['5%', '10%', 'freeShipping'];
  return rewards[Math.floor(Math.random() * rewards.length)];
}

export function getRewardLabel(type) {
  if (type === 'freeShipping') {
    return '무료배송';
  }

  return `${type} 할인`;
}
