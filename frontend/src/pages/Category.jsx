import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api.js';
import CategoryTitle from '../components/CategoryTitle.jsx';
import ProductFrame from '../components/product/ProductFrame.jsx';
import SortBar from '../components/common/SortBar.jsx';
import PaginationBar from '../components/common/PaginationBar.jsx';
import {
  getGalleryImages,
  getPricing,
  resolveCategoryListImages,
} from '../utils/productNormalize.js';
import './Category.css';

const CATEGORY_TITLE = {
  all: '전체',
  plate: '접시 / 찬기',
  bowl: '그릇',
  cup_teaware: '컵 / 다기',
  vase: '화병',
  decor: '장식',
};

const LIMIT = 8;

function parsePage(raw) {
  const n = parseInt(raw || '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    products: [],
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });

  const category = searchParams.get('category') || 'plate';
  const sort = searchParams.get('sort') || 'all';
  const page = parsePage(searchParams.get('page'));

  useEffect(() => {
    if (!searchParams.get('category')) {
      const next = new URLSearchParams(searchParams);
      next.set('category', 'plate');
      if (!next.get('sort')) next.set('sort', 'all');
      if (!next.get('page')) next.set('page', '1');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data: res } = await api.get('/api/products', {
          params: {
            category,
            sort,
            page,
            limit: LIMIT,
          },
        });
        if (!cancelled) {
          setData({
            products: res.products || [],
            total: res.total ?? 0,
            page: res.page ?? page,
            limit: res.limit ?? LIMIT,
            totalPages: res.totalPages ?? 1,
          });
          if (res.page != null && res.page !== page) {
            setSearchParams(
              {
                category,
                sort,
                page: String(res.page),
              },
              { replace: true }
            );
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message || e.message || '목록을 불러오지 못했습니다.'
          );
          setData((d) => ({ ...d, products: [] }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [category, sort, page, setSearchParams]);

  const sectionTitle = CATEGORY_TITLE[category] || category;

  function goPage(p) {
    setSearchParams({
      category,
      sort,
      page: String(p),
    });
  }

  return (
    <div>
      <CategoryTitle
        activeId={category}
        onSelect={(id) =>
          setSearchParams({
            category: id,
            sort,
            page: '1',
          })
        }
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <h2 style={{ margin: 0 }}>{sectionTitle}</h2>
        <SortBar
          value={sort}
          onChange={(id) =>
            setSearchParams({
              category,
              sort: id,
              page: '1',
            })
          }
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        {data.total} items
        {loading ? ' · 불러오는 중…' : null}
      </div>

      {error ? (
        <p role="alert" style={{ color: 'var(--color-point)' }}>
          {error}
        </p>
      ) : null}

      <div className="category-page__grid">
        {data.products.map((p) => {
          const { sale, original, discountRate } = getPricing(p);
          const { imageSrc, imageSrcFallback } = resolveCategoryListImages(category, p);
          const hoverImageSrc = getGalleryImages(p).find(
            (src) => src && src !== imageSrc && src !== imageSrcFallback
          );
          return (
            <ProductFrame
              key={p._id}
              product={p}
              to={`/product/${p._id}`}
              imageSrc={imageSrc}
              imageSrcFallback={imageSrcFallback}
              hoverImageSrc={hoverImageSrc}
              thumbSrc={imageSrc}
              productName={p.name}
              currentPrice={sale}
              originalPrice={original}
              discountPercent={discountRate}
            />
          );
        })}
      </div>

      {data.totalPages > 1 ? (
        <PaginationBar
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={goPage}
          ariaLabel="상품 목록 페이지"
        />
      ) : null}
    </div>
  );
}
