import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuthUser } from '../auth/session.js';
import { addToCart } from '../cart/cartStorage.js';
import { getWishlist, removeFromWishlist } from '../wishlist/wishlistStorage.js';
import PageWideBand from '../components/PageWideBand.jsx';
import SortBar from '../components/SortBar.jsx';
import PaginationBar from '../components/PaginationBar.jsx';
import { getPricing } from '../utils/productNormalize.js';

const PAGE_SIZE = 8;

function filterByName(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((p) => (p.name || '').toLowerCase().includes(q));
}

function sortList(list, sortId) {
  const arr = [...list];
  switch (sortId) {
    case 'popular':
      return arr.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    case 'latest':
      return arr.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    case 'price_desc':
      return arr.sort((a, b) => Number(b.price) - Number(a.price));
    case 'price_asc':
      return arr.sort((a, b) => Number(a.price) - Number(b.price));
    default:
      return arr;
  }
}

export default function Wishlist() {
  const user = getAuthUser();
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('all');
  const [page, setPage] = useState(1);

  const rawList = useMemo(() => {
    void reload;
    void user?.id;
    return getWishlist();
  }, [reload, user?.id]);

  const filtered = useMemo(
    () => filterByName(rawList, search),
    [rawList, search]
  );

  const sorted = useMemo(() => sortList(filtered, sort), [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    const onWishlistUpdated = () => setReload((n) => n + 1);
    window.addEventListener('shopmall-wishlist-updated', onWishlistUpdated);
    return () =>
      window.removeEventListener('shopmall-wishlist-updated', onWishlistUpdated);
  }, []);

  const effectivePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, effectivePage]);

  function refresh() {
    setReload((n) => n + 1);
  }

  function handleRemove(e, productId) {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(productId);
    if (page > 1 && pageItems.length === 1 && effectivePage === page) {
      setPage(Math.max(1, page - 1));
    }
    refresh();
  }

  function handleAddCart(e, product) {
    e.preventDefault();
    e.stopPropagation();
    const ok = addToCart(product, 1, '');
    alert(ok ? '장바구니에 담았습니다.' : '이미 장바구니에 있는 상품입니다.');
  }

  function goPage(p) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  return (
    <div>
      <PageWideBand text="위시리스트" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <div style={{ flex: '1 1 240px' }}>
          <h1 style={{ marginTop: 0 }}>위시리스트</h1>
          <div>
            <label htmlFor="wishlist-search">상품명 검색</label>
            <br />
            <input
              id="wishlist-search"
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="상품명 입력"
              style={{ width: '100%', maxWidth: 360, boxSizing: 'border-box' }}
            />
          </div>
        </div>
        <SortBar
          value={sort}
          onChange={(id) => {
            setSort(id);
            setPage(1);
          }}
        />
      </div>

      {sorted.length === 0 ? (
        <p>찜한 상품이 없습니다.</p>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            {sorted.length} items · 페이지 {effectivePage} / {totalPages}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 12,
              marginBottom: 24,
            }}
          >
            {pageItems.map((p) => {
              const { sale, original, discountRate } = getPricing(p);
              const pct = discountRate;
              return (
                <div
                  key={p._id}
                  style={{
                    border: '1px solid var(--shadow-bright)',
                    display: 'flex',
                    flexDirection: 'row',
                    minWidth: 0,
                  }}
                >
                  <Link
                    to={`/product/${p._id}`}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      padding: 8,
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: '1',
                        background: 'var(--shadow-bright)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                        overflow: 'hidden',
                      }}
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span style={{ color: 'var(--shadow-deep)' }}>
                          No Image
                        </span>
                      )}
                    </div>
                    <div style={{ marginBottom: 4 }}>{p.name}</div>
                    <div
                      style={{ color: 'var(--color-point)', marginBottom: 2 }}
                    >
                      {pct > 0 ? `${pct}%` : '-'}
                    </div>
                    <div style={{ fontWeight: 'bold' }}>
                      {sale.toLocaleString()}원
                    </div>
                    {original != null && original > sale ? (
                      <div
                        style={{
                          color: 'var(--shadow-deep)',
                          textDecoration: 'line-through',
                        }}
                      >
                        {original.toLocaleString()}원
                      </div>
                    ) : null}
                  </Link>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      padding: 8,
                      borderLeft: '1px solid var(--shadow-bright)',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleAddCart(e, p)}
                    >
                      장바구니
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, p._id)}
                      aria-label="찜 해제"
                    >
                      ♡ 해제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <PaginationBar
              page={effectivePage}
              totalPages={totalPages}
              onPageChange={goPage}
              ariaLabel="위시리스트 페이지"
            />
          ) : null}
        </>
      )}
    </div>
  );
}
