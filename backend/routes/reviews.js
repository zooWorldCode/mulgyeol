import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { requireAuth } from '../lib/authMiddleware.js';

function toReviewResponse(review) {
  return {
    id: review._id.toString(),
    nickname: review.nickname,
    rating: review.rating,
    content: review.content,
    createdAt: review.createdAt,
  };
}

async function buildReviewPayload(productId) {
  const reviews = await Review.find({ product: productId })
    .sort({ createdAt: -1 })
    .lean();

  const distribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: reviews.filter((review) => review.rating === score).length,
  }));
  const total = reviews.length;
  const averageRating = total
    ? Number(
        (
          reviews.reduce((sum, review) => sum + review.rating, 0) / total
        ).toFixed(1)
      )
    : 0;

  return {
    reviews: reviews.map(toReviewResponse),
    total,
    averageRating,
    distribution,
  };
}

async function syncProductReviewStats(productId) {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$product',
        reviewCount: { $sum: 1 },
        rating: { $avg: '$rating' },
      },
    },
  ]);

  const nextStats = stats[0] || { reviewCount: 0, rating: 0 };
  await Product.findByIdAndUpdate(productId, {
    reviewCount: nextStats.reviewCount,
    rating: Number(nextStats.rating.toFixed(1)),
  });
}

export async function listProductReviews(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    const product = await Product.findById(id).select('_id').lean();
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(await buildReviewPayload(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

export const createProductReview = [
  requireAuth,
  async (req, res) => {
    try {
      const { id } = req.params;
      const rating = Number(req.body.rating);
      const content = String(req.body.content || '').trim();

      if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
      }

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: '별점을 선택해주세요.' });
      }

      if (content.length < 5) {
        return res
          .status(400)
          .json({ message: '리뷰 내용을 5자 이상 입력해주세요.' });
      }

      const product = await Product.findById(id).select('_id').lean();
      if (!product) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
      }

      const review = await Review.create({
        product: id,
        user: req.user.id,
        nickname: req.user.nickname,
        rating,
        content,
      });

      await syncProductReviewStats(id);

      res.status(201).json({
        review: toReviewResponse(review),
        ...(await buildReviewPayload(id)),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  },
];
