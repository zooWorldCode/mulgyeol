/**
 * 소셜 로그인 — 백엔드 `/api/auth/oauth/:provider/start` 로 브라우저 이동.
 * 콜백 후 `/login?token=...` 으로 돌아오며, Login 페이지에서 토큰을 저장합니다.
 *
 * 각 개발자 콘솔에 등록할 리다이렉트 URI (로컬 기본):
 *   {FRONTEND_PUBLIC_URL}/api/auth/oauth/google/callback
 *   {FRONTEND_PUBLIC_URL}/api/auth/oauth/kakao/callback
 *   {FRONTEND_PUBLIC_URL}/api/auth/oauth/naver/callback
 * (백엔드 .env 의 FRONTEND_PUBLIC_URL 과 동일한 오리진, 기본 http://localhost:5173)
 */

export const SOCIAL_PROVIDER_IDS = /** @type {const} */ ([
  'naver',
  'kakao',
  'google',
]);

const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function oauthStartUrl(provider) {
  const path = `/api/auth/oauth/${provider}/start`;
  if (apiBase) return `${apiBase}${path}`;
  return path;
}

/** @type {Record<(typeof SOCIAL_PROVIDER_IDS)[number], () => void>} */
export const socialLoginHandlers = {
  naver() {
    window.location.assign(oauthStartUrl('naver'));
  },
  kakao() {
    window.location.assign(oauthStartUrl('kakao'));
  },
  google() {
    window.location.assign(oauthStartUrl('google'));
  },
};

export const SOCIAL_PROVIDER_LABELS = {
  naver: '네이버',
  kakao: '카카오',
  google: '구글',
};
