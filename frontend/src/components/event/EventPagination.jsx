/**
 * @param {{ page: number; totalPages: number; onPageChange: (p: number) => void }} props
 */
export default function EventPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="event-pagination" aria-label="페이지">
      <div
        className="event-pagination__inner"
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}
      >
        <button
          type="button"
          className="event-pagination__btn event-pagination__btn--first"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          className="event-pagination__btn event-pagination__btn--prev"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          &lt;
        </button>
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            className={
              'event-pagination__btn event-pagination__btn--num' +
              (n === page ? ' event-pagination__btn--active' : '')
            }
            disabled={n === page}
            onClick={() => onPageChange(n)}
            style={{
              minWidth: 32,
              fontWeight: n === page ? 'bold' : 'normal',
              border:
                n === page
                  ? '2px solid var(--color-point)'
                  : '1px solid var(--shadow-bright)',
            }}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          className="event-pagination__btn event-pagination__btn--next"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          &gt;
        </button>
        <button
          type="button"
          className="event-pagination__btn event-pagination__btn--last"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          &gt;&gt;
        </button>
      </div>
    </nav>
  );
}
