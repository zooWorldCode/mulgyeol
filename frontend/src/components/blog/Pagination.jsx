/**
 * @param {{ page: number; totalPages: number; onPageChange: (p: number) => void }} props
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="blog-pagination" aria-label="블로그 페이지">
      <div
        className="blog-pagination__inner"
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}
      >
        <button
          type="button"
          className="blog-pagination__btn blog-pagination__btn--first"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          className="blog-pagination__btn blog-pagination__btn--prev"
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
              'blog-pagination__btn blog-pagination__btn--num' +
              (n === page ? ' blog-pagination__btn--active' : '')
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
          className="blog-pagination__btn blog-pagination__btn--next"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          &gt;
        </button>
        <button
          type="button"
          className="blog-pagination__btn blog-pagination__btn--last"
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          &gt;&gt;
        </button>
      </div>
    </nav>
  );
}
