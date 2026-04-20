/**
 * 소셜 로그인 — UI만. 실제 OAuth 연동 시 아래 핸들러만 교체하면 됩니다.
 * (예: window.location.href = NAVER_AUTH_URL)
 */

export const SOCIAL_PROVIDER_IDS = /** @type {const} */ ([
  'naver',
  'kakao',
  'google',
]);

/** @type {Record<(typeof SOCIAL_PROVIDER_IDS)[number], () => void>} */
export const socialLoginHandlers = {
  naver() {
    // TODO: 네이버 OAuth 시작
  },
  kakao() {
    // TODO: 카카오 OAuth 시작
  },
  google() {
    // TODO: 구글 OAuth 시작
  },
};

export const SOCIAL_PROVIDER_LABELS = {
  naver: '네이버',
  kakao: '카카오',
  google: '구글',
};
