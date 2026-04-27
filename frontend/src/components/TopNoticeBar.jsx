import { useLocation } from 'react-router-dom';
import './TopNoticeBar.css';

/** 한 줄에 보여줄 문구들. 필요 시 이 배열만 수정하면 됩니다. */
export const TOP_NOTICE_MESSAGES = [
  '신규 회원 가입 시 첫 구매 25% 할인',
  '3만 원 이상 구매 시 무료 배송',
];

const HIDDEN_PATHS = ['/login', '/signup'];

export default function TopNoticeBar() {
  const { pathname } = useLocation();
  const normalized = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  if (HIDDEN_PATHS.includes(normalized)) {
    return null;
  }

  const text = TOP_NOTICE_MESSAGES.filter(Boolean).join(' · ');

  return (
    <div className="top-notice-bar" role="region" aria-label="사이트 공지">
      <p className="top-notice-bar__text">{text}</p>
    </div>
  );
}
