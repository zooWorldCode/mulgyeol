import { Link, useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthUser } from '../auth/session.js';

const SIDE_MENU = [
  { key: 'home', label: '홈', to: '/' },
  { key: 'orders', label: '주문/배송 조회' },
  { key: 'returns', label: '취소/반품/교환' },
  { key: 'address', label: '배송지 관리' },
  { key: 'coupon', label: '쿠폰' },
  { key: 'point', label: '포인트' },
  { key: 'review', label: '상품 후기' },
  { key: 'profile', label: '회원 정보 수정' },
];

const DUMMY_SUMMARY = {
  activeOrders: 2,
  coupons: 3,
  points: 1500,
  wishlist: 12,
};

const DUMMY_RECENT_ORDERS = [
  {
    id: 'O-20260401-001',
    date: '2026-04-01',
    productName: '샘플 상품 A',
    status: '배송 중',
  },
  {
    id: 'O-20260328-002',
    date: '2026-03-28',
    productName: '샘플 상품 B',
    status: '배송 완료',
  },
  {
    id: 'O-20260320-003',
    date: '2026-03-20',
    productName: '샘플 상품 C',
    status: '결제 완료',
  },
];

export default function MyPage() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const nickname = user?.nickname || '회원';

  function handleLogout() {
    clearAuthSession();
    navigate('/');
  }

  function handleWithdraw() {
    alert('회원탈퇴 기능은 준비 중입니다.');
  }

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <aside
        style={{
          minWidth: 180,
          borderRight: '1px solid var(--shadow-bright)',
          paddingRight: 16,
        }}
      >
        <nav>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>마이페이지 메뉴</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {SIDE_MENU.map((item) => (
              <li key={item.key} style={{ marginBottom: 6 }}>
                {item.to ? (
                  <Link to={item.to}>{item.label}</Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {}}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'default',
                      textAlign: 'left',
                      font: 'inherit',
                      color: 'var(--color-text)',
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 20,
          }}
        >
          <span>{nickname}님, 환영합니다.</span>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
          <button type="button" onClick={handleWithdraw}>
            회원탈퇴
          </button>
        </div>

        <h1 style={{ marginTop: 0 }}>마이페이지</h1>

        <section style={{ marginBottom: 24 }}>
          <h2>요약</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ border: '1px solid var(--shadow-bright)', padding: 12, minWidth: 120 }}>
              <div>진행 중인 주문</div>
              <div>{DUMMY_SUMMARY.activeOrders}건</div>
            </div>
            <div style={{ border: '1px solid var(--shadow-bright)', padding: 12, minWidth: 120 }}>
              <div>보유 쿠폰</div>
              <div>{DUMMY_SUMMARY.coupons}장</div>
            </div>
            <div style={{ border: '1px solid var(--shadow-bright)', padding: 12, minWidth: 120 }}>
              <div>보유 포인트</div>
              <div>{DUMMY_SUMMARY.points.toLocaleString()}P</div>
            </div>
            <div style={{ border: '1px solid var(--shadow-bright)', padding: 12, minWidth: 120 }}>
              <div>찜한 상품</div>
              <div>{DUMMY_SUMMARY.wishlist}개</div>
            </div>
          </div>
        </section>

        <section>
          <h2>최근 주문 내역</h2>
          <div style={{ border: '1px solid var(--shadow-bright)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1.2fr 1fr',
                gap: 8,
                padding: 8,
                borderBottom: '1px solid var(--shadow-bright)',
                fontWeight: 'bold',
              }}
            >
              <span>주문번호</span>
              <span>주문일</span>
              <span>상품명</span>
              <span>상태</span>
            </div>
            {DUMMY_RECENT_ORDERS.map((row) => (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1.2fr 1fr',
                  gap: 8,
                  padding: 8,
                  borderBottom: '1px solid var(--shadow-bright)',
                }}
              >
                <span>{row.id}</span>
                <span>{row.date}</span>
                <span>{row.productName}</span>
                <span>{row.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
