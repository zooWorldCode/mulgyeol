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

const DEFAULT_REVIEWS = [
  {
    id: 'default-r1',
    nickname: '물결회원',
    date: '2026.02.05',
    rating: 4,
    content:
      '유약 표현이 은은해서 어떤 식탁에도 잘 어울려요. 컬러와 마감이 좋아서 매일 손이 갑니다.',
  },
  {
    id: 'default-r2',
    nickname: '도자기취향',
    date: '2026.02.20',
    rating: 4,
    content:
      '손에 잡히는 무게감이 안정적이에요. 포장도 꼼꼼하고 선물용으로도 만족스러웠습니다.',
  },
  {
    id: 'default-r3',
    nickname: '세라믹러버',
    date: '2026.03.03',
    rating: 5,
    content:
      '사진보다 실물이 더 고급스러워요. 다음에는 같은 라인으로 컵도 추가 구매하려고 합니다.',
  },
  {
    id: 'default-r4',
    nickname: '인테리어랩',
    date: '2026.03.12',
    rating: 5,
    content:
      '쉐입이 부드럽고 표면 질감도 좋아요. 데일리로 바로 쓰기 좋은 균형감이 있습니다.',
  },
  {
    id: 'default-r5',
    nickname: '예상보다',
    date: '2026.03.19',
    rating: 4,
    content:
      '재질감이 좋아 보이고 가격대도 만족스러워요. 테이블 위에서 존재감이 은근히 큽니다.',
  },
  {
    id: 'default-r6',
    nickname: '주방기록',
    date: '2026.03.27',
    rating: 5,
    content:
      '사진보다 분위기가 더 살아 있어서 손님상 차릴 때 특히 예쁘게 느껴졌어요.',
  },
  {
    id: 'default-r7',
    nickname: '데일리픽',
    date: '2026.04.02',
    rating: 4,
    content:
      '크기감도 좋고 마감도 깔끔해서 입문용으로 만족해요. 다른 색도 있으면 사고 싶어요.',
  },
  {
    id: 'default-r8',
    nickname: '생활자인',
    date: '2026.04.11',
    rating: 5,
    content:
      '일상에서 매일 쓰기 좋은 타입입니다. 배송도 무난했고 전체적으로 만족도가 높아요.',
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

function normalizeReview(review) {
  return {
    ...review,
    date: review.date || formatReviewDate(review.createdAt),
  };
}

function buildDistribution(reviews) {
  return [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: reviews.filter((review) => Number(review.rating) === score).length,
  }));
}

function getAverageRating(reviews, fallback = 4.2) {
  if (!reviews.length) return Number(fallback) || 0;

  return Number(
    (
      reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      reviews.length
    ).toFixed(1)
  );
}

function getCurrentUser() {
  const storedUser = getAuthUser();
  if (storedUser) return storedUser;
  const token = getAuthToken();
  return token ? parseUserFromAccessToken(token) : null;
}

export default function ProductDetailTabs({ product }) {
  const [activeTab, setActiveTab] = useState('detail');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviews, setReviews] = useState([]);
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
        setReviewPage(1);
      } catch (err) {
        if (!cancelled) {
          setReviewError(
            err.response?.data?.message ||
              '리뷰를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
          );
        }
      }
    }

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const normalizedReviews = useMemo(() => {
    const userReviews = reviews.map(normalizeReview);
    const defaultReviews = DEFAULT_REVIEWS.map(normalizeReview);
    return [...userReviews, ...defaultReviews];
  }, [reviews]);

  const reviewCount = normalizedReviews.length;
  const averageRating = getAverageRating(normalizedReviews, product?.rating);

  const reviewSummary = useMemo(
    () => ({
      averageRating,
      totalReviews: reviewCount,
      distribution: buildDistribution(normalizedReviews),
    }),
    [averageRating, normalizedReviews, reviewCount]
  );

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(normalizedReviews.length / pageSize));
  const pagedReviews = normalizedReviews.slice(
    (reviewPage - 1) * pageSize,
    reviewPage * pageSize
  );

  async function handleSubmitReview(event) {
    event.preventDefault();

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
      setContentInput('');
      setRatingInput(5);
      setReviewPage(1);
      setIsReviewFormOpen(false);
    } catch (err) {
      setReviewError(
        err.response?.data?.message ||
          '리뷰 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="product-detail-tabs" aria-label="상품 상세 정보">
      <div className="product-detail-tabs__nav" role="tablist">
        {TAB_ITEMS.map((tab) => {
          const active = activeTab === tab.id;
          const label =
            tab.id === 'reviews' ? `리뷰(${reviewCount})` : tab.label;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`product-detail-tab-${tab.id}`}
              className={
                'product-detail-tabs__tab' +
                (active ? ' product-detail-tabs__tab--active' : '')
              }
              aria-selected={active}
              aria-controls="product-detail-tab-panel"
              onClick={() => setActiveTab(tab.id)}
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
                '상품 배송 및 배송비 안내는 주문 단계에서 다시 확인하실 수 있습니다.'}
            </p>
            <h3 className="product-detail-tabs__subheading">교환 / 반품</h3>
            <ul className="product-detail-tabs__bullet-list">
              <li>상품 수령 후 7일 이내 교환 및 반품 요청이 가능합니다.</li>
              <li>단순 변심에 의한 교환 및 반품 배송비는 고객 부담입니다.</li>
              <li>파손 및 불량은 수령 후 48시간 이내 고객센터로 연락해 주세요.</li>
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
              상품 문의 게시판은 준비 중입니다. 급한 문의는 고객센터로 연락해
              주세요.
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
                x
              </button>
            </div>

            <label className="review-modal__field">
              <span>닉네임</span>
              <input
                type="text"
                value={currentUser?.nickname || '로그인이 필요합니다.'}
                readOnly
              />
            </label>

            <label className="review-modal__field">
              <span>별점</span>
              <select
                value={ratingInput}
                onChange={(event) => setRatingInput(Number(event.target.value))}
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
                onChange={(event) => setContentInput(event.target.value)}
                placeholder="상품 사용 후기를 적어주세요."
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
