const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomPart(length) {
  let value = '';
  for (let i = 0; i < length; i += 1) {
    value += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return value;
}

export function generateCouponCode() {
  return `${randomPart(4)}-${randomPart(4)}`;
}
