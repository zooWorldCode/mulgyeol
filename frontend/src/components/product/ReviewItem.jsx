import './ReviewItem.css';

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    i < Math.round(rating) ? '★' : '☆'
  ).join('');
}

/**
 * @param {{ review: { id: string; nickname: string; date: string; rating: number; content: string } }} props
 */
export default function ReviewItem({ review }) {
  return (
    <article className="review-item">
      <div className="review-item__avatar" aria-hidden />
      <div className="review-item__body">
        <header className="review-item__meta">
          <strong className="review-item__nickname">{review.nickname}</strong>
          <time className="review-item__date">{review.date}</time>
        </header>
        <p className="review-item__stars" aria-label={`${review.rating}점`}>
          {renderStars(review.rating)}
        </p>
        <p className="review-item__content">{review.content}</p>
      </div>
    </article>
  );
}
