/**
 * @param {{ value: string; onChange: (v: string) => void }} props
 */
export default function BlogSearchBar({ value, onChange }) {
  return (
    <div className="blog-search-bar" style={{ flex: '1 1 280px', minWidth: 0 }}>
      <div
        className="blog-search-bar__inner"
        style={{ display: 'flex', border: '1px solid var(--shadow-deep)', alignItems: 'center' }}
      >
        <input
          id="blog-search-input"
          type="search"
          className="blog-search-bar__input"
          placeholder="검색어를 직접 입력해 주세요"
          aria-label="게시글 검색"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            padding: '8px 10px',
            minWidth: 0,
          }}
        />
        <span
          className="blog-search-bar__icon"
          aria-hidden
          style={{ padding: '0 10px' }}
        >
          🔍
        </span>
      </div>
    </div>
  );
}
