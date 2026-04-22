import './PaginationBar.css';

const NAV_ICONS = {
  first: '/images/icon/pagenation_L_end.png',
  prev: '/images/icon/pagenation_L.png',
  next: '/images/icon/pagenation_R.png',
  last: '/images/icon/pagenation_R_end.png',
};

/**
 * @param {{
 *   page: number;
 *   totalPages: number;
 *   onPageChange: (p: number) => void;
 *   className?: string;
 *   ariaLabel?: string;
 * }} props
 */
export default function PaginationBar({
  page,
  totalPages,
  onPageChange,
  className = '',
  ariaLabel = '페이지',
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className={['pagination-bar', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      <div className="pagination-bar__inner">
        <div className="pagination-bar__nav-group">
          <button
            type="button"
            className="pagination-bar__nav"
            disabled={page <= 1}
            onClick={() => onPageChange(1)}
            aria-label="첫 페이지"
          >
            <img
              className="pagination-bar__nav-icon"
              src={NAV_ICONS.first}
              alt=""
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="pagination-bar__nav"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="이전 페이지"
          >
            <img
              className="pagination-bar__nav-icon"
              src={NAV_ICONS.prev}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="pagination-bar__pages">
          {pages.map((n) => {
            const active = n === page;
            return (
              <button
                key={n}
                type="button"
                className={
                  active
                    ? 'pagination-bar__page pagination-bar__page--active'
                    : 'pagination-bar__page'
                }
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  if (!active) onPageChange(n);
                }}
              >
                {n}
              </button>
            );
          })}
        </div>

        <div className="pagination-bar__nav-group">
          <button
            type="button"
            className="pagination-bar__nav"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="다음 페이지"
          >
            <img
              className="pagination-bar__nav-icon"
              src={NAV_ICONS.next}
              alt=""
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="pagination-bar__nav"
            disabled={page >= totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="마지막 페이지"
          >
            <img
              className="pagination-bar__nav-icon"
              src={NAV_ICONS.last}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
