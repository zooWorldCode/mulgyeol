import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api.js';
import ProductGallery from '../components/product/ProductGallery.jsx';
import ProductInfo from '../components/product/ProductInfo.jsx';
import ProductDetailTabs from '../components/product/ProductDetailTabs.jsx';
import { CATEGORY_LABELS } from '../constants/categoryLabels.js';
import {
  getGalleryImages,
  resolveCategoryListImages,
} from '../utils/productNormalize.js';
import './ProductDetail.css';

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

  const listImagePair = useMemo(
    () => (product ? resolveCategoryListImages(product.category, product) : null),
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
      <div className="product-detail__hero">
        <div className="product-detail__hero-gallery">
          <ProductGallery
            images={galleryImages}
            productName={product.name}
            listImagePrimary={listImagePair?.imageSrc ?? null}
            listImageFallback={listImagePair?.imageSrcFallback ?? null}
          />
        </div>
        <div className="product-detail__hero-info">
          <nav className="product-detail__breadcrumb" aria-label="breadcrumb">
            <ol className="product-detail__breadcrumb-list">
              <li className="product-detail__breadcrumb-item">
                <Link to="/">홈</Link>
              </li>
              <li aria-hidden="true">
                {' '}&gt;{' '}
              </li>
              <li className="product-detail__breadcrumb-item">
                <Link to="/category">카테고리</Link>
              </li>
              <li aria-hidden="true">
                {' '}&gt;{' '}
              </li>
              <li className="product-detail__breadcrumb-item">
                <Link to={`/category?category=${encodeURIComponent(product.category)}`}>
                  {catName}
                </Link>
              </li>
              <li aria-hidden="true">
                {' '}&gt;{' '}
              </li>
              <li className="product-detail__breadcrumb-item product-detail__breadcrumb-item--current">
                {product.name}
              </li>
            </ol>
          </nav>
          <ProductInfo product={product} />
        </div>
      </div>

      <ProductDetailTabs product={product} />
    </div>
  );
}
