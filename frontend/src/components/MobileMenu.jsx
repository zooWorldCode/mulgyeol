import { Link, useNavigate } from 'react-router-dom';
import Button from './common/Button.jsx';
import './MobileMenu.css';

export const MOBILE_MAIN_MENUS = [
  {
    label: '카테고리',
    to: '/category',
    subItems: ['접시', '그릇', '컵/다기', '화병', '장식'],
  },
  {
    label: '이벤트',
    to: '/event',
    subItems: ['이벤트', '이벤트 현황', '기획전', '프로모션'],
  },
  {
    label: '브랜드',
    to: '/brand',
    subItems: ['스토리', 'BI', '작가', '브랜드 소식'],
  },
  {
    label: '커뮤니티',
    to: '/community',
    subItems: ['블로그', '공지사항', '고객센터'],
  },
];

export const MOBILE_ICON_MENUS = [
  { label: '검색', to: '/search', iconPath: '/images/icon/search.svg' },
  { label: '장바구니', to: '/cart', iconPath: '/images/icon/cart.svg' },
  { label: '위시리스트', to: '/wishlist', iconPath: '/images/icon/wishlist.svg' },
  { label: '마이페이지', to: '/mypage', iconPath: '/images/icon/mypage.svg' },
];

export default function MobileMenu({
  open,
  onClose,
  onSearchOpen,
  mainMenus = MOBILE_MAIN_MENUS,
  iconMenus = MOBILE_ICON_MENUS,
}) {
  const navigate = useNavigate();

  function go(path) {
    onClose();
    navigate(path);
  }

  return (
    <div className={'mobile-menu' + (open ? ' mobile-menu--open' : '')}>
      <button
        type="button"
        className="mobile-menu__backdrop"
        aria-label="모바일 메뉴 닫기"
        onClick={onClose}
      />

      <aside className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="모바일 메뉴">
        <div className="mobile-menu__top">
          <button type="button" className="mobile-menu__close" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <nav className="mobile-menu__main-nav" aria-label="모바일 주 메뉴">
          {mainMenus.map((menu) => (
            <div key={menu.label} className="mobile-menu__main-item">
              <Link
                to={menu.to}
                className="mobile-menu__main-link"
                onClick={onClose}
              >
                {menu.label}
              </Link>
              {menu.subItems?.length ? (
                <div className="mobile-menu__submenu">
                  {menu.subItems.map((sub) => (
                    <button key={sub} type="button" className="mobile-menu__submenu-item">
                      {sub}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <nav className="mobile-menu__icon-nav" aria-label="모바일 아이콘 메뉴">
          {iconMenus.map((menu) =>
            menu.label === '검색' && onSearchOpen ? (
              <button
                key={menu.label}
                type="button"
                className="mobile-menu__icon-link"
                onClick={() => {
                  onClose();
                  onSearchOpen();
                }}
              >
                <img src={menu.iconPath} alt="" className="mobile-menu__icon" aria-hidden />
                <span>{menu.label}</span>
              </button>
            ) : (
              <Link key={menu.label} to={menu.to} className="mobile-menu__icon-link" onClick={onClose}>
                <img src={menu.iconPath} alt="" className="mobile-menu__icon" aria-hidden />
                <span>{menu.label}</span>
              </Link>
            ),
          )}
        </nav>

        <div className="mobile-menu__auth">
          <Button type="button" className="mobile-menu__auth-btn" onClick={() => go('/login')}>
            로그인
          </Button>
          <Button type="button" className="mobile-menu__auth-btn" onClick={() => go('/signup')}>
            회원가입
          </Button>
        </div>
      </aside>
    </div>
  );
}
