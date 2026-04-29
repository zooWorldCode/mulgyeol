import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCartLines } from '../cart/cartStorage.js';
import HeaderDropdown from './HeaderDropdown.jsx';
import MobileMenu from './MobileMenu.jsx';
import SearchModal from './SearchModal.jsx';
import './Header.css';

function getCartCount() {
  return getCartLines().reduce(
    (sum, line) => sum + Math.max(1, Number(line.quantity) || 1),
    0
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => getCartCount());

  useEffect(() => {
    if (!mobileMenuOpen && !searchOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen, searchOpen]);

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartCount());

    window.addEventListener('shopmall-cart-updated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('shopmall-cart-updated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <div
      className={`header-hover-area${dropdownOpen ? ' header-hover-area--dropdown-open' : ''}`}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <header className="site-header">
        <div className="container site-header__inner">
          <div className="site-header__row">
            <nav
              className="site-header__main-nav"
              aria-label="주 메뉴"
              onMouseEnter={() => setDropdownOpen(true)}
            >
              <Link to="/" className="site-header__nav-link site-header__logo">
                <img src="/images/logo/CI_logo.svg" alt="홈" width={70} />
              </Link>
              <Link to="/category" className="site-header__nav-link">
                카테고리
              </Link>
              <Link to="/event" className="site-header__nav-link">
                이벤트
              </Link>
              <Link to="/brand" className="site-header__nav-link">
                브랜드
              </Link>
              <Link to="/community" className="site-header__nav-link">
                커뮤니티
              </Link>
            </nav>

            <nav className="site-header__icon-nav" aria-label="아이콘 메뉴">
              <button
                type="button"
                className="site-header__icon-link"
                title="검색"
                aria-label="검색"
                onClick={() => setSearchOpen(true)}
              >
                <img src="/images/icon/search.svg" alt="" className="site-header__icon-img" />
              </button>
              <Link
                to="/cart"
                className="site-header__icon-link site-header__icon-link--cart"
                title="장바구니"
                aria-label="장바구니"
              >
                <img src="/images/icon/cart.svg" alt="" className="site-header__icon-img" />
                {cartCount > 0 ? (
                  <span className="site-header__cart-badge" aria-label={`장바구니 ${cartCount}개`}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                ) : null}
              </Link>
              <Link
                to="/wishlist"
                className="site-header__icon-link"
                title="위시리스트"
                aria-label="위시리스트"
              >
                <img src="/images/icon/wishlist.svg" alt="" className="site-header__icon-img" />
              </Link>
              <Link
                to="/mypage"
                className="site-header__icon-link"
                title="마이페이지"
                aria-label="마이페이지"
              >
                <img src="/images/icon/mypage.svg" alt="" className="site-header__icon-img" />
              </Link>
              <button
                type="button"
                className="site-header__hamburger"
                aria-label="메뉴 열기"
                title="메뉴"
                onClick={() => setMobileMenuOpen(true)}
              >
                <img src="/images/icon/hamberger.svg" alt="" className="site-header__icon-img" />
              </button>
            </nav>
          </div>
        </div>
      </header>
      <HeaderDropdown />
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSearchOpen={() => {
          setMobileMenuOpen(false);
          setSearchOpen(true);
        }}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
