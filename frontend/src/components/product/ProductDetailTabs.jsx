import { useEffect, useMemo, useState } from 'react';
import api from '../../api.js';
import {
  getAuthToken,
  getAuthUser,
  parseUserFromAccessToken,
} from '../../auth/session.js';
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

const FALLBACK_REVIEWS = [
  {
    id: 'r1',
    nickname: '물결회원',
    date: '2026.02.05',
    rating: 4,
    content:
      '디자인이 깔끔해서 어떤 식탁에도 잘 어울려요. 컬러와 마감이 좋아서 매일 손이 갑니다.',
  },
  {
    id: 'r2',
    nickname: '도자기좋아',
    date: '2026.02.20',
    rating: 4,
    content:
      '실사용하기 좋은 무게감이에요. 포장도 꼼꼼했고 선물용으로도 만족스러웠습니다.',
  },
  {
    id: 'r3',
    nickname: '세라믹러버',
    date: '2026.03.03',
    rating: 5,
    content:
      '사진보다 실물이 더 고급스러워요. 다음에는 같은 라인으로 컵도 추가 구매하려고 합니다.',
  },
];

function formatReviewDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\s/g, '');
}

function buildDistribution(reviews) {
  return [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: reviews.filter((review) => Number(review.rating) === score).length,
  }));
}

function getCurrentUser() {
  const storedUser = getAuthUser();
  if (storedUser) return storedUser;
  const token = getAuthToken();
  return token ? parseUserFromAccessToken(token) : null;
}

/**
 * @param {{ product: object }} props
 */
export default function ProductDetailTabs({ product }) {
  const [activeTab, setActiveTab] = useState('detail');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState(null);
  const [reviewError, setReviewError] = useState('');
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [contentInput, setContentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUser] = useState(() => getCurrentUser());

  const productId = product?._id || product?.id;

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      if (!productId) return;
      setReviewError('');
      try {
        const { data } = await api.get(`/api/products/${productId}/reviews`);
        if (cancelled) return;
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setReviewMeta({
          total: Number(data.total) || 0,
          averageRating: Number(data.averageRating) || 0,
          distribution: Array.isArray(data.distribution)
            ? data.distribution
            : null,
        });
        setReviewPage(1);
      } catch (err) {
        if (!cancelled) {
          setReviewError(
            err.response?.data?.message ||
              '리뷰를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      }
    }

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const displayReviews = reviews.length > 0 ? reviews : FALLBACK_REVIEWS;
  const normalizedReviews = displayReviews.map((review) => ({
    ...review,
    date: review.date || formatReviewDate(review.createdAt),
  }));

  const reviewCount =
    reviewMeta && reviews.length > 0
      ? reviewMeta.total
      : Number(product.reviewCount ?? normalizedReviews.length) || 0;
  const averageRating =
    reviewMeta && reviews.length > 0
      ? reviewMeta.averageRating
      : Number(product.rating || 4.2);

  const reviewSummary = useMemo(
    () => ({
      averageRating,
      totalReviews: reviewCount,
      distribution:
        reviewMeta?.distribution && reviews.length > 0
          ? reviewMeta.distribution
          : buildDistribution(normalizedReviews),
    }),
    [averageRating, normalizedReviews, reviewCount, reviewMeta, reviews.length]
  );

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(normalizedReviews.length / pageSize));
  const pagedReviews = normalizedReviews.slice(
    (reviewPage - 1) * pageSize,
    reviewPage * pageSize
  );

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!currentUser) {
      setReviewError('로그인 후 리뷰를 작성할 수 있습니다.');
      return;
    }

    setSubmitting(true);
    setReviewError('');
    try {
      const { data } = await api.post(`/api/products/${productId}/reviews`, {
        rating: ratingInput,
        content: contentInput,
      });
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setReviewMeta({
        total: Number(data.total) || 0,
        averageRating: Number(data.averageRating) || 0,
        distribution: Array.isArray(data.distribution) ? data.distribution : [],
      });
      setContentInput('');
      setRatingInput(5);
      setReviewPage(1);
      setIsReviewFormOpen(false);
    } catch (err) {
      setReviewError(
        err.response?.data?.message ||
          '리뷰 등록에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="product-detail-tabs" aria-label="상품 상세 정보">
      <div className="product-detail-tabs__nav" role="tablist">
        {TAB_ITEMS.map((t) => {
          const active = activeTab === t.id;
          const label = t.id === 'reviews' ? `리뷰(${reviewCount})` : t.label;
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
              {product.shippingNote ||
                '상품 배송 및 배송비와 지역 안내는 주문 단계에서 확인할 수 있습니다.'}
            </p>
            <h3 className="product-detail-tabs__subheading">교환 / 반품</h3>
            <ul className="product-detail-tabs__bullet-list">
              <li>상품 수령 후 7일 이내 교환 및 반품 신청이 가능합니다.</li>
              <li>단순 변심에 의한 교환 및 반품 배송비는 고객 부담입니다.</li>
              <li>파손 및 불량은 수령 후 48시간 이내 고객센터로 연락해주세요.</li>
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
            {reviewError ? (
              <p className="product-detail-tabs__review-message" role="alert">
                {reviewError}
              </p>
            ) : null}
            <ReviewList reviews={pagedReviews} />
            <div className="product-detail-tabs__review-action">
              <Button
                type="button"
                className="product-detail-tabs__review-button"
                onClick={() => setIsReviewFormOpen(true)}
              >
                리뷰 작성하기
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
              상품 문의 게시판은 준비 중입니다. 급한 문의는 고객센터로 연락해주세요.
            </p>
          </div>
        ) : null}
      </div>

      {isReviewFormOpen ? (
        <div className="review-modal" role="presentation">
          <div className="review-modal__backdrop" aria-hidden="true" />
          <form
            className="review-modal__dialog"
            aria-label="리뷰 작성"
            onSubmit={handleSubmitReview}
          >
            <div className="review-modal__header">
              <h2 className="review-modal__title">리뷰 작성</h2>
              <button
                type="button"
                className="review-modal__close"
                aria-label="닫기"
                onClick={() => setIsReviewFormOpen(false)}
              >
                ×
              </button>
            </div>

            <label className="review-modal__field">
              <span>닉네임</span>
              <input
                type="text"
                value={currentUser?.nickname || '로그인이 필요합니다'}
                readOnly
              />
            </label>

            <label className="review-modal__field">
              <span>별점</span>
              <select
                value={ratingInput}
                onChange={(e) => setRatingInput(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((score) => (
                  <option key={score} value={score}>
                    {score}점
                  </option>
                ))}
              </select>
            </label>

            <label className="review-modal__field">
              <span>내용</span>
              <textarea
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                placeholder="상품을 사용해본 느낌을 적어주세요."
                rows={6}
                maxLength={1000}
                required
              />
            </label>

            <div className="review-modal__actions">
              <Button
                type="button"
                className="common-btn--inline review-modal__cancel"
                onClick={() => setIsReviewFormOpen(false)}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="common-btn--inline"
                disabled={submitting || !currentUser}
              >
                {submitting ? '등록 중...' : '등록하기'}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
