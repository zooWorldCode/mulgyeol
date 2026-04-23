import SearchField from '../common/SearchField.jsx';

/**
 * @param {{ value: string; onChange: (v: string) => void }} props
 */
export default function BlogSearchBar({ value, onChange }) {
  return (
    <SearchField
      id="blog-search-input"
      value={value}
      onChange={onChange}
      placeholder="검색어를 직접 입력해 주세요"
      ariaLabel="게시글 검색"
      className="blog-search-bar"
    />
  );
}
