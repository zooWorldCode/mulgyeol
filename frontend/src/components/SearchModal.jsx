import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import './SearchModal.css';

const PLACEHOLDER = '찾고자 하시는 상품을 검색해주세요';

const POPULAR_KEYWORDS = [
  '화이트 그릇',
  '꽃 접시',
  '동물 장식',
  '엘레강스 화분',
  '커플 컵 세트',
  '화이트 그릇',
  '꽃 접시',
  '동물 장식',
  '엘레강스 화분',
  '커플 컵 세트',
];

export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  async function navigateByKeyword(rawKeyword) {
    const keyword = rawKeyword.trim();
    if (!keyword) return;

    try {
      const { data } = await api.get('/api/products', {
        params: { page: 1, limit: 200 },
      });
      const products = Array.isArray(data?.products) ? data.products : [];
      const normalized = keyword.toLowerCase();
      const matched = products.find((p) =>
        String(p?.name || '')
          .toLowerCase()
          .includes(normalized)
      );
      const category = matched?.category ? String(matched.category) : '';

      if (category) {
        navigate(`/category?category=${encodeURIComponent(category)}`);
        return true;
      }
    } catch {
      // Ignore API errors and handle with the same message below.
    }

    alert('해당 상품은 존재하지 않습니다.');
    return false;
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      const moved = await navigateByKeyword(q);
      if (moved) onClose();
    }
  }

  async function pickKeyword(term) {
    const moved = await navigateByKeyword(term);
    if (moved) onClose();
  }

  const node = (
    <div className="search-modal" role="dialog" aria-modal="true" aria-label="상품 검색">
      <button
        type="button"
        className="search-modal__backdrop"
        aria-label="검색 닫기"
        onClick={onClose}
      />
      <div className="search-modal__panel">
        <div className="search-modal__inner">
          <form className="search-modal__form" onSubmit={submit}>
            <div className="search-modal__field">
              <label htmlFor="search-modal-input" className="visually-hidden">
                상품 검색
              </label>
              <input
                id="search-modal-input"
                ref={inputRef}
                type="search"
                name="q"
                className="search-modal__input"
                placeholder={PLACEHOLDER}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="search-modal__submit" aria-label="검색 실행">
                <img src="/images/icon/search.svg" alt="" width={26} height={26} />
              </button>
            </div>
          </form>

          <h2 className="search-modal__popular-title">인기 검색어</h2>
          <ol className="search-modal__popular-grid">
            {POPULAR_KEYWORDS.map((text, i) => (
              <li key={`${i}-${text}`}>
                <button
                  type="button"
                  className="search-modal__keyword"
                  onClick={() => pickKeyword(text)}
                >
                  <span className="search-modal__keyword-num">{i + 1}</span>
                  <span>{text}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <button type="button" className="search-modal__close" onClick={onClose} aria-label="검색 닫기">
        <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden focusable="false">
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );

  return createPortal(node, document.body);
}
