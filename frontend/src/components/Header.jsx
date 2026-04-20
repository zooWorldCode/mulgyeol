import { Link } from 'react-router-dom';

const navText = { textDecoration: 'none', color: 'inherit' };

const iconLink = {
  ...navText,
  fontSize: 22,
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 36,
  minHeight: 36,
};

export default function Header() {
  return (
    <header
      className="site-header"
      style={{
        borderBottom: '1px solid #ccc',
      }}
    >
      <div className="container" style={{ padding: '10px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <nav
            aria-label="주 메뉴"
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Link to="/" style={navText}>
              홈
            </Link>
            <Link to="/category" style={navText}>
              카테고리
            </Link>
            <Link to="/event" style={navText}>
              이벤트
            </Link>
            <Link to="/brand" style={navText}>
              브랜드
            </Link>
            <Link to="/community" style={navText}>
              커뮤니티
            </Link>
          </nav>

          <nav
            aria-label="아이콘 메뉴"
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Link to="/search" style={iconLink} title="검색" aria-label="검색">
              🔍
            </Link>
            <Link
              to="/cart"
              style={iconLink}
              title="장바구니"
              aria-label="장바구니"
            >
              🛒
            </Link>
            <Link
              to="/wishlist"
              style={iconLink}
              title="위시리스트"
              aria-label="위시리스트"
            >
              ♡
            </Link>
            <Link
              to="/mypage"
              style={iconLink}
              title="마이페이지"
              aria-label="마이페이지"
            >
              👤
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
