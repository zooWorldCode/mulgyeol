/**
 * JWT payload에서 사용자 표시용 필드만 읽습니다 (서명 검증 없음 — 서버가 준 토큰만 사용).
 * @param {string} token
 * @returns {{ id: string, email: string, nickname: string } | null}
 */
export function parseUserFromAccessToken(token) {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const pad = '='.repeat((4 - (b64.length % 4)) % 4);
    const json = JSON.parse(atob(b64 + pad));
    if (!json.sub) return null;
    return {
      id: String(json.sub),
      email: json.email != null ? String(json.email) : '',
      nickname: json.nickname != null ? String(json.nickname) : '',
    };
  } catch {
    return null;
  }
}

const TOKEN_KEY = 'token';
const USER_KEY = 'authUser';
const REMEMBER_UNTIL_KEY = 'authRememberUntil';

/** “로그인 저장” 시 유지 기간 (밀리초) — 만료 후 자동 무효 */
export const REMEMBER_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function clearStoredUser() {
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_KEY);
}

function setStoredUser(remember, user) {
  clearStoredUser();
  if (!user) return;
  const raw = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(USER_KEY, raw);
  } else {
    sessionStorage.setItem(USER_KEY, raw);
  }
}

/**
 * @param {string} token
 * @param {boolean} remember - true: localStorage + 만료 시각, false: sessionStorage(탭 종료 시 제거)
 * @param {{ id?: string, email?: string, nickname?: string } | null} [user]
 */
export function persistAuthToken(token, remember, user = null) {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_UNTIL_KEY);
  clearStoredUser();

  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_UNTIL_KEY, String(Date.now() + REMEMBER_DURATION_MS));
    setStoredUser(true, user);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    setStoredUser(false, user);
  }
}

export function getAuthToken() {
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  if (sessionToken) return sessionToken;

  const untilRaw = localStorage.getItem(REMEMBER_UNTIL_KEY);
  const persisted = localStorage.getItem(TOKEN_KEY);
  if (!persisted || !untilRaw) return null;

  const until = Number(untilRaw);
  if (Number.isNaN(until) || Date.now() > until) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_UNTIL_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }

  return persisted;
}

/** @returns {{ id?: string, email?: string, nickname?: string } | null} */
export function getAuthUser() {
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  if (sessionToken) {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  const token = getAuthToken();
  if (!token) return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_UNTIL_KEY);
}
