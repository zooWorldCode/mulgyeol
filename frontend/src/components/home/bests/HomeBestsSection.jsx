import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api.js';
import SortBar from '../../common/SortBar.jsx';
import ProductFrame from '../../product/ProductFrame.jsx';
import { getPricing, resolveCategoryListImages } from '../../../utils/productNormalize.js';
import './HomeBestsSection.css';

const tabs = [
  { id: 'plate', label: '접시' },
  { id: 'bowl', label: '그릇' },
  { id: 'cup_teaware', label: '잔' },
  { id: 'vase', label: '화병' },
  { id: 'decor', label: '장식' },
];

export default function HomeBestsSection() {
  const [activeTab, setActiveTab] = useState('plate');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const { data } = await api.get('/api/products', {
          params: {
            category: activeTab,
            sort: 'popular',
            page: 1,
            limit: 8,
          },
        });

        if (!cancelled) {
          setProducts(data.products || []);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const visibleProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <section className="home-bests" aria-labelledby="home-bests-title">
      <div className="home-bests__head">
        <Link to={`/category?category=${activeTab}`} className="home-bests__heading">
          <h2 id="home-bests-title">베스트 상품들</h2>
          <span aria-hidden="true">→</span>
        </Link>

        <SortBar
          options={tabs}
          value={activeTab}
          onChange={setActiveTab}
          className="home-bests__sort"
          ariaLabel="베스트 상품 카테고리"
        />
      </div>

      {visibleProducts.length === 0 ? (
        <p className="home-bests__empty">상품을 준비 중입니다.</p>
      ) : (
        <div className="home-bests__grid">
          {visibleProducts.map((product) => {
            const { sale, original, discountRate } = getPricing(product);
            const { imageSrc, imageSrcFallback } = resolveCategoryListImages(
              activeTab,
              product
            );

            return (
              <ProductFrame
                key={product._id}
                product={product}
                to={`/product/${product._id}`}
                imageSrc={imageSrc}
                imageSrcFallback={imageSrcFallback}
                thumbSrc={imageSrc}
                productName={product.name}
                currentPrice={sale}
                originalPrice={original}
                discountPercent={discountRate}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
