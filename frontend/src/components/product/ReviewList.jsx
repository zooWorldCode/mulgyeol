import ReviewItem from './ReviewItem.jsx';
import './ReviewList.css';

/**
 * @param {{ reviews: Array<{ id: string; nickname: string; date: string; rating: number; content: string }> }} props
 */
export default function ReviewList({ reviews }) {
  return (
    <section className="review-list" aria-label="리뷰 리스트">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </section>
  );
}
