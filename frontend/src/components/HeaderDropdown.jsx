import { Link } from 'react-router-dom';

export const HEADER_SUBMENU_GROUPS = [
  {
    title: '카테고리',
    items: ['접시', '그릇', '컵/다기', '화병', '장식'],
  },
  {
    title: '이벤트',
    items: ['진행 중 이벤트', '기획전'],
  },
  {
    title: '브랜드',
    items: ['브랜드 스토리','브랜드 소식'],
  },
  {
    title: '커뮤니티',
    items: ['블로그', 'FAQ', '공지사항'],
  },
];

export default function HeaderDropdown({
  submenuGroups = HEADER_SUBMENU_GROUPS,
}) {
  return (
    <div className="header-dropdown-panel" aria-hidden>
      <div className="header-dropdown-panel__inner">
        <ul className="header-dropdown-rows" aria-label="드롭다운 메뉴">
          {submenuGroups.map((group, index) => (
            <li
              key={group.title}
              className={
                'header-dropdown-row' +
                (index === 0 ? ' header-dropdown-row--primary' : '')
              }
            >
              <Link to="/" className="header-dropdown-row__title">
                {group.title}
              </Link>
              <div className="header-dropdown-row__items">
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="header-dropdown-row__item-btn"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
