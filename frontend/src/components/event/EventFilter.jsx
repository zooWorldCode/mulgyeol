const FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'preview', label: '예리뷰' },
  { id: 'ongoing', label: '진행중' },
  { id: 'ended', label: '종료된' },
];

/**
 * @param {{ active: string; onChange: (id: string) => void }} props
 */
export default function EventFilter({ active, onChange }) {
  return (
    <nav className="event-filter" aria-label="이벤트 카테고리">
      <ul
        className="event-filter__list"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {FILTERS.map((f) => (
          <li key={f.id} className="event-filter__item">
            <button
              type="button"
              className={
                'event-filter__btn' +
                (active === f.id ? ' event-filter__btn--active' : '')
              }
              onClick={() => onChange(f.id)}
              style={{
                border: '1px solid var(--shadow-bright)',
                padding: '6px 14px',
                background:
                  active === f.id ? 'var(--color-point)' : 'var(--color-white)',
                color: active === f.id ? 'var(--color-white)' : 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
