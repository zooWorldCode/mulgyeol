import { getAuthUser } from '../auth/session.js';

const PREFIX = 'shopmall_points';

function storageKey() {
  const u = getAuthUser();
  const id = u?.id;
  return id ? `${PREFIX}_${id}` : PREFIX;
}

function emitPointUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('shopmall-point-updated'));
  }
}

export function getPointBalance() {
  try {
    const raw = localStorage.getItem(storageKey());
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
  } catch {
    return 0;
  }
}

export function setPointBalance(nextBalance) {
  const safe = Math.max(0, Math.floor(Number(nextBalance) || 0));
  localStorage.setItem(storageKey(), String(safe));
  emitPointUpdated();
}

export function addPointBalance(delta) {
  const amount = Math.max(0, Math.floor(Number(delta) || 0));
  if (amount <= 0) return getPointBalance();
  const next = getPointBalance() + amount;
  setPointBalance(next);
  return next;
}

export function spendPointBalance(delta) {
  const amount = Math.max(0, Math.floor(Number(delta) || 0));
  if (amount <= 0) return getPointBalance();
  const current = getPointBalance();
  const used = Math.min(current, amount);
  const next = current - used;
  setPointBalance(next);
  return { used, balance: next };
}

export function calcEarnedPoints(amount) {
  const n = Number(amount) || 0;
  return Math.max(0, Math.floor(n * 0.01));
}
