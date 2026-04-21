import './SortBar.css';

export const PRODUCT_SORT_OPTIONS = [
  { id: 'all', label: '전체' },
  { id: 'popular', label: '인기순' },
  { id: 'latest', label: '최신순' },
  { id: 'price_desc', label: '가격 높은 순' },
  { id: 'price_asc', label: '가격 낮은 순' },
];

/** 이벤트 목록 상태 필터 (Event.jsx) */
export const EVENT_STATUS_OPTIONS = [
  { id: 'all', label: '전체' },
  { id: 'preview', label: '예리뷰' },
  { id: 'ongoing', label: '진행중' },
  { id: 'ended', label: '종료된' },
];

/** 블로그·커뮤니티 글 정렬 (BlogPage.jsx) */
export const BLOG_SORT_OPTIONS = [
  { id: 'all', label: '전체' },
  { id: 'popular', label: '인기순' },
  { id: 'latest', label: '최신순' },
];

export default function SortBar({
  options = PRODUCT_SORT_OPTIONS,
  value,
  onChange,
  className = '',
  ariaLabel = '정렬',
}) {
  return (
    <div
      className={['sort-bar', className].filter(Boolean).join(' ')}
      role="toolbar"
      aria-label={ariaLabel}
    >
      {options.map((s) => {
        const active = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            className={active ? 'sort-bar__btn sort-bar__btn--active' : 'sort-bar__btn'}
            aria-pressed={active}
            onClick={() => onChange(s.id)}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
