import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api.js';
import ProductGallery from '../components/product/ProductGallery.jsx';
import ProductInfo from '../components/product/ProductInfo.jsx';
import ProductTabs from '../components/product/ProductTabs.jsx';
import { CATEGORY_LABELS } from '../constants/categoryLabels.js';
import { getGalleryImages } from '../utils/productNormalize.js';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/api/products/${id}`);
        if (!cancelled) setProduct(data);
      } catch (e) {
        if (!cancelled) {
          setProduct(null);
          setError(
            e.response?.data?.message ||
              e.message ||
              '상품을 불러오지 못했습니다.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const galleryImages = useMemo(
    () => (product ? getGalleryImages(product) : []),
    [product]
  );

  if (loading) {
    return (
      <div className="product-detail product-detail--loading">
        <p>불러오는 중…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail product-detail--error">
        <p role="alert" style={{ color: 'var(--color-point)' }}>
          {error || '상품을 찾을 수 없습니다.'}
        </p>
        <Link to="/category">카테고리로</Link>
      </div>
    );
  }

  const catName =
    CATEGORY_LABELS[product.category] || product.category || '카테고리';

  return (
    <div className="product-detail">
      <nav className="product-detail__breadcrumb" aria-label="breadcrumb">
        <ol
          className="product-detail__breadcrumb-list"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <li className="product-detail__breadcrumb-item">
            <Link to="/">홈</Link>
          </li>
          <li aria-hidden="true">{'>'}</li>
          <li className="product-detail__breadcrumb-item">
            <Link to="/category">카테고리</Link>
          </li>
          <li aria-hidden="true">{'>'}</li>
          <li className="product-detail__breadcrumb-item">
            <Link to={`/category?category=${encodeURIComponent(product.category)}`}>
              {catName}
            </Link>
          </li>
          <li aria-hidden="true">{'>'}</li>
          <li className="product-detail__breadcrumb-item product-detail__breadcrumb-item--current">
            {product.name}
          </li>
        </ol>
      </nav>

      <div
        className="product-detail__main-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          alignItems: 'flex-start',
        }}
      >
        <div className="product-detail__col product-detail__col--gallery">
          <ProductGallery images={galleryImages} productName={product.name} />
        </div>
        <div className="product-detail__col product-detail__col--info">
          <ProductInfo product={product} />
        </div>
      </div>

      <ProductTabs product={product} />
    </div>
  );
}
