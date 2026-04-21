import './ReviewSummary.css';

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    i < Math.round(rating) ? '★' : '☆'
  ).join('');
}

/**
 * @param {{
 *   averageRating: number;
 *   totalReviews: number;
 *   distribution: Array<{ score: number; count: number }>;
 * }} props
 */
export default function ReviewSummary({
  averageRating,
  totalReviews,
  distribution,
}) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <section className="review-summary" aria-label="리뷰 요약">
      <div className="review-summary__left">
        <strong className="review-summary__rating">
          {averageRating.toFixed(1)}
        </strong>
        <p className="review-summary__stars" aria-label={`평점 ${averageRating}점`}>
          {renderStars(averageRating)}
        </p>
        <p className="review-summary__count">
          리뷰 {totalReviews.toLocaleString('ko-KR')}개
        </p>
      </div>

      <div className="review-summary__right">
        {distribution.map((row) => {
          const width = (row.count / maxCount) * 100;
          return (
            <div key={row.score} className="review-summary__bar-row">
              <span className="review-summary__score">{row.score}점</span>
              <div className="review-summary__bar-track" aria-hidden>
                <span
                  className="review-summary__bar-fill"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
