import { useState } from 'react';
import { getDetailSpecs } from '../../utils/productNormalize.js';

const TABS = [
  { id: 'detail', label: '상세설명' },
  { id: 'shipping', label: '배송/교환/반품' },
  { id: 'reviews', label: '리뷰' },
];

/**
 * @param {{ product: object }} props
 */
export default function ProductTabs({ product }) {
  const [active, setActive] = useState('detail');
  const specs = getDetailSpecs(product);

  return (
    <section className="product-tabs" style={{ marginTop: 32 }}>
      <div className="product-tabs__nav" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            className={
              'product-tabs__tab' +
              (active === t.id ? ' product-tabs__tab--active' : '')
            }
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="product-tabs__panel" role="tabpanel">
        {active === 'detail' ? (
          <div className="product-tabs__detail">
            <h2 className="product-tabs__heading">상품 상세</h2>
            <p className="product-tabs__description">{product.description}</p>
            <h3 className="product-tabs__subheading">스펙</h3>
            <ul className="product-tabs__spec-list">
              {specs.map((row) => (
                <li key={row.label} className="product-tabs__spec-item">
                  <span className="product-tabs__spec-label">{row.label}</span>
                  : {row.value}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {active === 'shipping' ? (
          <div className="product-tabs__shipping">
            <h2 className="product-tabs__heading">배송 안내</h2>
            <p>{product.shippingNote}</p>
            <h3 className="product-tabs__subheading">교환/반품</h3>
            <ul className="product-tabs__bullet-list">
              <li>상품 수령 후 7일 이내 교환·반품 신청 가능합니다.</li>
              <li>단순 변심 시 왕복 배송비는 고객 부담입니다.</li>
              <li>파손·불량은 수령 후 48시간 이내 고객센터로 연락해 주세요.</li>
            </ul>
          </div>
        ) : null}

        {active === 'reviews' ? (
          <div className="product-tabs__reviews">
            <h2 className="product-tabs__heading">리뷰</h2>
            <p>리뷰 목록은 추후 API 연동 예정입니다.</p>
            <p>
              현재 집계: 평균 {Number(product.rating || 0).toFixed(1)}점 ·
              리뷰 {Number(product.reviewCount || 0)}건
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
