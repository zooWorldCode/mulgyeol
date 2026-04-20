const SORTS = [
  { id: 'all', label: '전체' },
  { id: 'popular', label: '인기순' },
  { id: 'latest', label: '최신순' },
];

/**
 * @param {{ active: string; onChange: (id: string) => void }} props
 */
export default function BlogSortMenu({ active, onChange }) {
  return (
    <div className="blog-sort-menu">
      <ul
        className="blog-sort-menu__list"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {SORTS.map((s) => (
          <li key={s.id} className="blog-sort-menu__item">
            <button
              type="button"
              className={
                'blog-sort-menu__btn' +
                (active === s.id ? ' blog-sort-menu__btn--active' : '')
              }
              onClick={() => onChange(s.id)}
              style={{
                border: '1px solid var(--shadow-bright)',
                padding: '6px 12px',
                background:
                  active === s.id ? 'var(--color-point)' : 'var(--color-white)',
                color: active === s.id ? 'var(--color-white)' : 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
