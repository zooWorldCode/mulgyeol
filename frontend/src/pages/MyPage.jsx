import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthUser } from '../auth/session.js';
import PageWideBand from '../components/PageWideBand.jsx';
import './MyPage.css';

const PLATE_IMG =
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=176&h=176&fit=crop&q=80';

const SIDE_MENU = [
  { key: 'home', label: '홈', icon: 'home' },
  { key: 'orders', label: '주문/배송 조회', icon: 'truck' },
  { key: 'returns', label: '취소/반품/교환', icon: 'return' },
  { key: 'address', label: '배송지 관리', icon: 'pin' },
  { key: 'coupon', label: '쿠폰', icon: 'ticket' },
  { key: 'point', label: '포인트', icon: 'coins' },
  { key: 'review', label: '상품 후기', icon: 'pencil' },
  { key: 'profile', label: '회원 정보 수정', icon: 'user' },
];

const DUMMY_SUMMARY = {
  activeOrders: 2,
  coupons: 3,
  points: 12000,
  wishlist: 8,
};

const DUMMY_RECENT_ORDERS = [
  {
    id: 'O-20260418-001',
    name: '모던 세라믹 디너 플레이트',
    option: '화이트 / 4P 세트',
    priceOriginal: 48000,
    priceSale: 38400,
    status: '배송중',
  },
  {
    id: 'O-20260417-002',
    name: '모던 세라믹 디너 플레이트',
    option: '화이트 / 4P 세트',
    priceOriginal: 48000,
    priceSale: 38400,
    status: '배송중',
  },
  {
    id: 'O-20260416-003',
    name: '모던 세라믹 디너 플레이트',
    option: '화이트 / 4P 세트',
    priceOriginal: 48000,
    priceSale: 38400,
    status: '배송중',
  },
];

function MenuIcon({ name, size = 20 }) {
  const stroke = 'currentColor';
  const sw = 1.75;
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw };
  switch (name) {
    case 'home':
      return (
        <svg {...common} aria-hidden>
          <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" strokeLinejoin="round" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...common} aria-hidden>
          <path d="M3 7h11v9H3V7zm11 3h3l3 3v3h-6v-6z" strokeLinejoin="round" />
          <circle cx="7.5" cy="18" r="1.5" fill={stroke} stroke="none" />
          <circle cx="17" cy="18" r="1.5" fill={stroke} stroke="none" />
        </svg>
      );
    case 'return':
      return (
        <svg {...common} aria-hidden>
          <path d="M4 7v6a4 4 0 0 0 4 4h3M4 7l3 3m-3-3l3-3" strokeLinecap="round" />
          <path d="M20 17V11a4 4 0 0 0-4-4h-3m7 10l-3-3m3 3l-3 3" strokeLinecap="round" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common} aria-hidden>
          <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.25" fill={stroke} stroke="none" />
        </svg>
      );
    case 'ticket':
      return (
        <svg {...common} aria-hidden>
          <path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.2a1.5 1.5 0 0 0 0 2.6V14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.2a1.5 1.5 0 0 0 0-2.6V9z" strokeLinejoin="round" />
          <path d="M9 10v4M15 10v4" strokeLinecap="round" />
        </svg>
      );
    case 'coins':
      return (
        <svg {...common} aria-hidden>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v4c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
          <path d="M5 10v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4" />
        </svg>
      );
    case 'pencil':
      return (
        <svg {...common} aria-hidden>
          <path d="M4 20l4.5-1.5L17 9.5 14.5 7 6.5 15 4 20z" strokeLinejoin="round" />
          <path d="M12.5 8.5l3 3" strokeLinecap="round" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common} aria-hidden>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M6.5 20v-1c0-2.5 2-4.5 5.5-4.5s5.5 2 5.5 4.5v1" strokeLinecap="round" />
          <path d="M18 6v4M16 8h4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function SummaryIcon({ name, size = 26 }) {
  const stroke = 'currentColor';
  const sw = 1.6;
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw };
  switch (name) {
    case 'truck':
      return (
        <svg {...common} aria-hidden>
          <path d="M2 8h12v8H2V8zm12 2h3l3 3v3h-6v-8z" strokeLinejoin="round" />
          <circle cx="7" cy="18" r="1.5" fill={stroke} stroke="none" />
          <circle cx="17" cy="18" r="1.5" fill={stroke} stroke="none" />
        </svg>
      );
    case 'ticket':
      return (
        <svg {...common} aria-hidden>
          <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.3a1.5 1.5 0 0 0 0 2.4V14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.3a1.5 1.5 0 0 0 0-2.4V9z" strokeLinejoin="round" />
        </svg>
      );
    case 'coins':
      return (
        <svg {...common} aria-hidden>
          <ellipse cx="12" cy="6.5" rx="7" ry="3" />
          <path d="M5 6.5v3.5c0 1.6 3.13 2.9 7 2.9s7-1.3 7-2.9V6.5" />
          <path d="M5 10v3.5c0 1.6 3.13 2.9 7 2.9s7-1.3 7-2.9V10" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common} aria-hidden>
          <path
            d="M12 20s-7.2-4.35-9.6-8.4C.4 8.9 2.1 6 5 6c1.8 0 3.2 1 4 2.3C9.8 7 11.2 6 13 6c2.9 0 4.6 2.9 2.6 5.6C13.2 15.65 12 20 12 20z"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function MyPage() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const nickname = user?.nickname || '00';
  const [activeMenu, setActiveMenu] = useState('home');

  function handleLogout() {
    clearAuthSession();
    navigate('/');
  }

  function handleWithdraw() {
    alert('회원탈퇴 기능은 준비 중입니다.');
  }

  function formatWon(n) {
    return `${n.toLocaleString('ko-KR')}원`;
  }

  return (
    <div className="mypage">
      <PageWideBand text="마이페이지" />
      <div className="mypage__shell">
        <aside className="mypage__sidebar">
          <nav className="mypage__nav" aria-label="마이페이지 메뉴">
            {SIDE_MENU.map((item) => (
              <button
                key={item.key}
                type="button"
                className={
                  item.key === activeMenu
                    ? 'mypage__nav-item mypage__nav-item--active'
                    : 'mypage__nav-item'
                }
                onClick={() => setActiveMenu(item.key)}
              >
                <MenuIcon name={item.icon} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mypage__cs">
            <h2 className="mypage__cs-title">고객센터</h2>
            <p className="mypage__cs-phone">1234-5678</p>
            <p className="mypage__cs-note">
              운영시간 10:00~17:00
              <br />
              점심시간 12:00~13:00
              <br />
              주말·공휴일 휴무
            </p>
          </div>
        </aside>

        <div className="mypage__main">
          <div className="mypage__topbar">
            <p className="mypage__greeting">
              {nickname}님, 반갑습니다.
              <br />
              오늘도 즐거운 하루 보내세요
            </p>
            <div className="mypage__actions">
              <button type="button" className="mypage__ghost-btn" onClick={handleLogout}>
                로그아웃
              </button>
              <button type="button" className="mypage__ghost-btn" onClick={handleWithdraw}>
                회원탈퇴
              </button>
            </div>
          </div>

          <section className="mypage__summary" aria-label="나의 쇼핑 요약">
            <div className="mypage__summary-cell">
              <div className="mypage__summary-icon">
                <SummaryIcon name="truck" />
              </div>
              <p className="mypage__summary-label">진행 중인 주문</p>
              <p className="mypage__summary-value">{DUMMY_SUMMARY.activeOrders} 건</p>
            </div>
            <div className="mypage__summary-cell">
              <div className="mypage__summary-icon">
                <SummaryIcon name="ticket" />
              </div>
              <p className="mypage__summary-label">보유 쿠폰</p>
              <p className="mypage__summary-value">{DUMMY_SUMMARY.coupons} 장</p>
            </div>
            <div className="mypage__summary-cell">
              <div className="mypage__summary-icon">
                <SummaryIcon name="coins" />
              </div>
              <p className="mypage__summary-label">보유 포인트</p>
              <p className="mypage__summary-value">{DUMMY_SUMMARY.points.toLocaleString('ko-KR')} P</p>
            </div>
            <div className="mypage__summary-cell">
              <div className="mypage__summary-icon">
                <SummaryIcon name="heart" />
              </div>
              <p className="mypage__summary-label">찜한 상품</p>
              <p className="mypage__summary-value">{DUMMY_SUMMARY.wishlist} 개</p>
            </div>
          </section>

          <section aria-labelledby="mypage-recent-orders">
            <div className="mypage__section-head">
              <h2 id="mypage-recent-orders" className="mypage__section-title">
                최근 주문 내역
              </h2>
              <Link to="/order" className="mypage__section-link">
                주문 배송 조회 전체 보기
              </Link>
            </div>

            <div className="mypage__orders">
              {DUMMY_RECENT_ORDERS.map((row) => (
                <div key={row.id} className="mypage__order-row">
                  <img className="mypage__order-thumb" src={PLATE_IMG} alt="" width={88} height={88} />
                  <div className="mypage__order-body">
                    <div className="mypage__order-info">
                      <p className="mypage__order-name">{row.name}</p>
                      <p className="mypage__order-option">{row.option}</p>
                    </div>
                    <div className="mypage__order-tail">
                      <div className="mypage__order-price">
                        <del>{formatWon(row.priceOriginal)}</del>
                        <strong>{formatWon(row.priceSale)}</strong>
                      </div>
                      <span className="mypage__order-status">{row.status}</span>
                      <button type="button" className="mypage__order-detail">
                        주문 상세보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
