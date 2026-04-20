import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api.js';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'plate', label: '접시' },
  { id: 'bowl', label: '그릇' },
  { id: 'cup_teaware', label: '컵/다기' },
  { id: 'vase', label: '화병' },
  { id: 'decor', label: '장식' },
];

const SORT_OPTIONS = [
  { id: 'all', label: '전체' },
  { id: 'popular', label: '인기순' },
  { id: 'latest', label: '최신순' },
  { id: 'price_desc', label: '가격 높은 순' },
  { id: 'price_asc', label: '가격 낮은 순' },
];

const CATEGORY_TITLE = {
  all: '전체',
  plate: '접시',
  bowl: '그릇',
  cup_teaware: '컵/다기',
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

  const pageNumbers = useMemo(() => {
    const tp = data.totalPages || 1;
    return Array.from({ length: tp }, (_, i) => i + 1);
  }, [data.totalPages]);

  function goPage(p) {
    setSearchParams({
      category,
      sort,
      page: String(p),
    });
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>카테고리</h1>

      <div
        style={{
          border: '1px solid var(--shadow-bright)',
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  setSearchParams({
                    category: c.id,
                    sort,
                    page: '1',
                  })
                }
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  border: active
                    ? '2px solid var(--color-point)'
                    : '1px solid var(--shadow-deep)',
                  background: active ? 'var(--color-point)' : 'var(--shadow-bright)',
                  color: active ? 'var(--color-white)' : 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SORT_OPTIONS.map((s) => {
            const active = sort === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() =>
                  setSearchParams({
                    category,
                    sort: s.id,
                    page: '1',
                  })
                }
                style={{
                  border: '1px solid var(--shadow-bright)',
                  background: active ? 'var(--color-key)' : 'var(--color-white)',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {data.products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid var(--shadow-bright)',
              padding: 8,
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ color: 'var(--shadow-deep)' }}>
                  No Image
                </span>
              )}
            </div>
            <div style={{ marginBottom: 4 }}>{p.name}</div>
            <div>
              {Number(p.price).toLocaleString()}원
            </div>
          </Link>
        ))}
      </div>

      {data.totalPages > 1 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={data.page <= 1}
            onClick={() => goPage(1)}
          >
            &lt;&lt;
          </button>
          <button
            type="button"
            disabled={data.page <= 1}
            onClick={() => goPage(data.page - 1)}
          >
            &lt;
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goPage(n)}
              disabled={n === data.page}
              style={{
                minWidth: 32,
                fontWeight: n === data.page ? 'bold' : 'normal',
                border:
                  n === data.page
                    ? '2px solid var(--color-point)'
                    : '1px solid var(--shadow-bright)',
                background:
                  n === data.page ? 'var(--shadow-bright)' : 'var(--color-white)',
                cursor: n === data.page ? 'default' : 'pointer',
              }}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={data.page >= data.totalPages}
            onClick={() => goPage(data.page + 1)}
          >
            &gt;
          </button>
          <button
            type="button"
            disabled={data.page >= data.totalPages}
            onClick={() => goPage(data.totalPages)}
          >
            &gt;&gt;
          </button>
        </div>
      ) : null}
    </div>
  );
}
