import { useState } from 'react';
import ProductDetailInfoAccordion from './ProductDetailInfoAccordion.jsx';
import './ProductDetailTabs.css';

const TAB_ITEMS = [
  { id: 'detail', label: '상세정보' },
  { id: 'purchase', label: '구매/배송정보' },
  { id: 'reviews', label: '리뷰' },
  { id: 'qna', label: 'Q&A' },
];

/**
 * @param {{ product: object }} props
 */
export default function ProductDetailTabs({ product }) {
  const [activeTab, setActiveTab] = useState('detail');
  const reviewCount = Number(product.reviewCount ?? 0) || 0;

  return (
    <section className="product-detail-tabs" aria-label="상품 상세 탭">
      <div className="product-detail-tabs__nav" role="tablist">
        {TAB_ITEMS.map((t) => {
          const active = activeTab === t.id;
          const label =
            t.id === 'reviews' ? `리뷰(${reviewCount})` : t.label;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`product-detail-tab-${t.id}`}
              className={
                'product-detail-tabs__tab' +
                (active ? ' product-detail-tabs__tab--active' : '')
              }
              aria-selected={active}
              aria-controls="product-detail-tab-panel"
              onClick={() => setActiveTab(t.id)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        id="product-detail-tab-panel"
        className="product-detail-tabs__panel"
        role="tabpanel"
        aria-labelledby={`product-detail-tab-${activeTab}`}
      >
        {activeTab === 'detail' ? (
          <div className="product-detail-tabs__detail">
            {product.description ? (
              <p className="product-detail-tabs__description product-detail-tabs__description--lead">
                {product.description}
              </p>
            ) : null}
            <ProductDetailInfoAccordion />
          </div>
        ) : null}

        {activeTab === 'purchase' ? (
          <div className="product-detail-tabs__purchase">
            <h2 className="product-detail-tabs__heading">구매 / 배송 안내</h2>
            <p className="product-detail-tabs__description">
              {product.shippingNote || '택배 배송 · 배송비 및 지역 안내는 주문서 단계에서 확인할 수 있습니다.'}
            </p>
            <h3 className="product-detail-tabs__subheading">교환 / 반품</h3>
            <ul className="product-detail-tabs__bullet-list">
              <li>상품 수령 후 7일 이내 교환·반품 신청이 가능합니다.</li>
              <li>단순 변심에 의한 교환·반품 시 왕복 배송비는 고객 부담입니다.</li>
              <li>파손·불량은 수령 후 48시간 이내 고객센터로 연락해 주세요.</li>
            </ul>
          </div>
        ) : null}

        {activeTab === 'reviews' ? (
          <div className="product-detail-tabs__reviews">
            <h2 className="product-detail-tabs__heading">리뷰</h2>
            <p className="product-detail-tabs__muted">
              리뷰 목록은 추후 API 연동 예정입니다.
            </p>
            <p className="product-detail-tabs__description">
              현재 집계: 평균 {Number(product.rating || 0).toFixed(1)}점 · 리뷰{' '}
              {reviewCount.toLocaleString('ko-KR')}건
            </p>
          </div>
        ) : null}

        {activeTab === 'qna' ? (
          <div className="product-detail-tabs__qna">
            <h2 className="product-detail-tabs__heading">Q&A</h2>
            <p className="product-detail-tabs__muted">
              상품 문의 게시판은 준비 중입니다. 급하신 문의는 고객센터로 연락해 주세요.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
