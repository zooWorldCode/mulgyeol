import { useMemo, useState } from 'react';
import ProductDetailInfoAccordion from './ProductDetailInfoAccordion.jsx';
import Button from '../common/Button.jsx';
import PaginationBar from '../common/PaginationBar.jsx';
import ReviewSummary from './ReviewSummary.jsx';
import ReviewList from './ReviewList.jsx';
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
  const [reviewPage, setReviewPage] = useState(1);
  const reviewCount = Number(product.reviewCount ?? 0) || 0;
  const rating = Number(product.rating || 4.2);
  const totalReviews = reviewCount || 23;

  const reviewSummary = useMemo(
    () => ({
      averageRating: rating,
      totalReviews,
      distribution: [
        { score: 5, count: 17 },
        { score: 4, count: 12 },
        { score: 3, count: 2 },
        { score: 2, count: 0 },
        { score: 1, count: 1 },
      ],
    }),
    [rating, totalReviews]
  );

  const dummyReviews = useMemo(
    () => [
      {
        id: 'r1',
        nickname: '닉네임',
        date: '2026.02.05',
        rating: 4,
        content:
          '디자인이 정말 깔끔해서 어떤 음식이든 다 잘 어울려요. 화이트 컬러라 플레이팅 하기 좋고, 집들이 선물용으로도 만족스러웠습니다.',
      },
      {
        id: 'r2',
        nickname: '닉네임',
        date: '2026.02.20',
        rating: 4,
        content:
          '전자레인지 사용이 가능해 실용성까지 챙긴 제품이에요. 마감도 좋고 무게감도 적당해서 매일 손이 갑니다.',
      },
      {
        id: 'r3',
        nickname: '닉네임',
        date: '2026.02.26',
        rating: 4,
        content:
          '생각보다 사이즈가 넉넉해서 파스타나 브런치 담기 좋았습니다. 비슷한 디자인 대비 가격도 합리적인 편이에요.',
      },
      {
        id: 'r4',
        nickname: '닉네임',
        date: '2026.03.03',
        rating: 4,
        content:
          '광택이 과하지 않아 고급스럽고, 세척도 편해서 만족합니다. 다음에는 같은 라인으로 컵도 추가 구매하려고 합니다.',
      },
      {
        id: 'r5',
        nickname: '닉네임',
        date: '2026.03.12',
        rating: 3,
        content:
          '전체적으로 만족하지만 밝은 색이라 스크래치 관리에는 조금 신경 써야 해요. 그래도 분위기 있는 식탁 연출에는 최고입니다.',
      },
    ],
    []
  );

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(dummyReviews.length / pageSize));
  const pagedReviews = dummyReviews.slice(
    (reviewPage - 1) * pageSize,
    reviewPage * pageSize
  );

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
            <ReviewSummary
              averageRating={reviewSummary.averageRating}
              totalReviews={reviewSummary.totalReviews}
              distribution={reviewSummary.distribution}
            />
            <ReviewList reviews={pagedReviews} />
            <div className="product-detail-tabs__review-action">
              <Button
                type="button"
                className="product-detail-tabs__review-button"
                onClick={() => {}}
              >
                리뷰 작성하기 ↗
              </Button>
            </div>
            <PaginationBar
              page={reviewPage}
              totalPages={totalPages}
              onPageChange={setReviewPage}
              className="product-detail-tabs__pagination"
              ariaLabel="리뷰 페이지네이션"
            />
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
