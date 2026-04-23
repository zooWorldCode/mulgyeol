import { useRef } from 'react';
import './SearchField.css';

/**
 * @param {{
 *   id: string;
 *   value: string;
 *   onChange: (value: string) => void;
 *   placeholder?: string;
 *   ariaLabel?: string;
 *   className?: string;
 * }} props
 */
export default function SearchField({
  id,
  value,
  onChange,
  placeholder = '검색어를 입력해 주세요',
  ariaLabel = '검색',
  className = '',
}) {
  const inputRef = useRef(null);

  return (
    <div className={`search-field${className ? ` ${className}` : ''}`}>
      <input
        ref={inputRef}
        id={id}
        type="search"
        className="search-field__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
      />
      <button
        type="button"
        className="search-field__button"
        aria-label={ariaLabel}
        onClick={() => inputRef.current?.focus()}
      >
        <img src="/images/icon/search.svg" alt="" className="search-field__icon" />
      </button>
    </div>
  );
}
