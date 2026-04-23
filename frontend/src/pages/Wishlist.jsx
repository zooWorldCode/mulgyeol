import { useMemo, useState } from 'react';
import { getAuthUser } from '../auth/session.js';
import { getWishlist } from '../wishlist/wishlistStorage.js';
import PageWideBand from '../components/common/PageWideBand.jsx';
import SortBar from '../components/common/SortBar.jsx';
import PaginationBar from '../components/common/PaginationBar.jsx';
import SearchField from '../components/common/SearchField.jsx';
import ProductFrame from '../components/product/ProductFrame.jsx';
import { getPricing, resolveCategoryListImages } from '../utils/productNormalize.js';
import './Wishlist.css';

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
  const initialList = useMemo(() => {
    void user?.id;
    return getWishlist();
  }, [user?.id]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('all');
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => sortList(filterByName(initialList, search), sort),
    [initialList, search, sort]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const effectivePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, effectivePage]);

  function goPage(nextPage) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  }

  return (
    <div className="wishlist-page">
      <PageWideBand text="위시리스트" />

      <div className="wishlist-page__toolbar">
        <div className="wishlist-page__search">
          <SearchField
            id="wishlist-search"
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="상품명을 입력해 주세요"
            ariaLabel="상품명 검색"
          />
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
        <p className="wishlist-page__empty">찜한 상품이 없습니다.</p>
      ) : (
        <>
          <div className="wishlist-page__count">
            {sorted.length} items
          </div>

          <div className="wishlist-page__grid">
            {pageItems.map((p) => {
              const { sale, original, discountRate } = getPricing(p);
              const { imageSrc, imageSrcFallback } = resolveCategoryListImages(
                'all',
                p
              );

              return (
                <ProductFrame
                  key={p._id}
                  product={p}
                  to={`/product/${p._id}`}
                  imageSrc={imageSrc}
                  imageSrcFallback={imageSrcFallback}
                  thumbSrc={imageSrc}
                  productName={p.name}
                  currentPrice={sale}
                  originalPrice={original}
                  discountPercent={discountRate}
                />
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
