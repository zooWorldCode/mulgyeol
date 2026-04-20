import mongoose from 'mongoose';
import Product from '../models/Product.js';

const SORT_MAP = {
  popular: { popularity: -1 },
  latest: { createdAt: -1 },
  price_desc: { price: -1 },
  price_asc: { price: 1 },
};

function parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * GET /api/products
 * query: category, sort, page, limit
 */
export async function listProducts(req, res) {
  try {
    const category = req.query.category;
    const sortKey = req.query.sort;
    const page = parsePositiveInt(req.query.page, 1);
    const limit = Math.min(parsePositiveInt(req.query.limit, 8), 50);

    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const sort =
      sortKey && sortKey !== 'all' && SORT_MAP[sortKey]
        ? SORT_MAP[sortKey]
        : { _id: 1 };

    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const effectivePage = Math.min(page, totalPages);
    const skip = (effectivePage - 1) * limit;

    const items = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      products: items,
      total,
      page: effectivePage,
      limit,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

/**
 * GET /api/products/:id
 */
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
