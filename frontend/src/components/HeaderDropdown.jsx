import { Link, useLocation } from 'react-router-dom';

export const HEADER_SUBMENU_GROUPS = [
  {
    title: '카테고리',
    items: ['접시', '그릇', '컵/다기', '화병', '장식'],
  },
  {
    title: '이벤트',
    items: ['이벤트 안내', '기획전'],
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
  const { pathname, search } = useLocation();
  const titlePathMap = {
    카테고리: '/category',
    이벤트: '/event',
    브랜드: '/brand',
    커뮤니티: '/community',
  };
  const categoryPathMap = {
    접시: '/category?category=plate',
    그릇: '/category?category=bowl',
    '컵/다기': '/category?category=cup_teaware',
    화병: '/category?category=vase',
    장식: '/category?category=decor',
  };
  const submenuPathMap = {
    이벤트: {
      '이벤트 안내': '/event',
      기획전: '/event',
    },
    브랜드: {
      '브랜드 스토리': '/brand',
      '브랜드 소식': '/brand',
    },
    커뮤니티: {
      블로그: '/blog',
      FAQ: '/community',
      공지사항: '/community',
    },
  };

  const resolveItemPath = (groupTitle, item) => {
    if (groupTitle === '카테고리') {
      return categoryPathMap[item] ?? '/category';
    }

    return submenuPathMap[groupTitle]?.[item] ?? (titlePathMap[groupTitle] ?? '/');
  };
  const activeCategory = new URLSearchParams(search).get('category');
  const categoryItemValueMap = {
    접시: 'plate',
    그릇: 'bowl',
    '컵/다기': 'cup_teaware',
    화병: 'vase',
    장식: 'decor',
  };

  const isItemActive = (groupTitle, item) => {
    if (groupTitle === '카테고리') {
      return pathname === '/category' && activeCategory === categoryItemValueMap[item];
    }

    if (groupTitle === '이벤트') {
      return item === '이벤트 안내' && pathname.startsWith('/event');
    }

    if (groupTitle === '브랜드') {
      return item === '브랜드 스토리' && pathname.startsWith('/brand');
    }

    if (groupTitle === '커뮤니티') {
      const isCommunityPath = pathname.startsWith('/community') || pathname.startsWith('/blog');
      return item === '블로그' && isCommunityPath;
    }

    return false;
  };

  return (
    <div className="header-dropdown-panel" aria-hidden>
      <div className="header-dropdown-panel__inner">
        <ul className="header-dropdown-rows" aria-label="드롭다운 메뉴">
          {submenuGroups.map((group, index) => {
            const groupPath = titlePathMap[group.title] ?? '/';
            const isGroupPathMatch =
              pathname === groupPath || pathname.startsWith(`${groupPath}/`);
            const isCommunityBlogPath = group.title === '커뮤니티' && pathname.startsWith('/blog');
            const isActive = isGroupPathMatch || isCommunityBlogPath;

            return (
              <li
                key={group.title}
                className={
                  'header-dropdown-row' +
                  (index === 0 ? ' header-dropdown-row--primary' : '') +
                  (isActive ? ' header-dropdown-row--active' : '')
                }
              >
              <Link to={groupPath} className="header-dropdown-row__title">
                {group.title}
              </Link>
              <div className="header-dropdown-row__items">
                {group.items.map((item) => (
                  <Link
                    key={item}
                    to={resolveItemPath(group.title, item)}
                    className={
                      'header-dropdown-row__item-btn' +
                      (isItemActive(group.title, item)
                        ? ' header-dropdown-row__item-btn--active'
                        : '')
                    }
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
