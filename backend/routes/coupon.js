import { Router } from 'express';
import Coupon from '../models/Coupon.js';
import { generateCouponCode } from '../utils/couponCode.js';
import { addDays, getDateKey, getTodayRange } from '../utils/date.js';

const router = Router();
const REWARD_TYPES = new Set(['5%', '10%', 'freeShipping']);

function normalizeId(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function buildIdentifierQuery(userId, guestId) {
  const conditions = [];
  if (userId) {
    conditions.push({ userId });
  }
  if (guestId) {
    conditions.push({ guestId });
  }
  return conditions.length === 1 ? conditions[0] : { $or: conditions };
}

async function createUniqueCouponCode() {
  for (let i = 0; i < 5; i += 1) {
    const couponCode = generateCouponCode();
    const exists = await Coupon.exists({ couponCode });
    if (!exists) {
      return couponCode;
    }
  }

  throw new Error('Failed to create unique coupon code');
}

router.post('/issue', async (req, res) => {
  try {
    const userId = normalizeId(req.body.userId);
    const guestId = normalizeId(req.body.guestId);
    const rewardType = req.body.rewardType;

    if (!userId && !guestId) {
      return res.status(400).json({
        success: false,
        message: 'userId 또는 guestId가 필요합니다.',
      });
    }

    if (!REWARD_TYPES.has(rewardType)) {
      return res.status(400).json({
        success: false,
        message: '올바르지 않은 쿠폰 타입입니다.',
      });
    }

    const { start, end } = getTodayRange();
    const identifierQuery = buildIdentifierQuery(userId, guestId);
    const existingCoupon = await Coupon.findOne({
      ...identifierQuery,
      createdAt: { $gte: start, $lt: end },
    }).lean();

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: '오늘 이미 쿠폰이 발급되었습니다.',
        coupon: existingCoupon,
      });
    }

    const now = new Date();
    const coupon = await Coupon.create({
      userId,
      guestId,
      type: rewardType,
      couponCode: await createUniqueCouponCode(),
      issuedDate: getDateKey(now),
      expiresAt: addDays(now, 7),
    });

    return res.status(201).json({
      success: true,
      coupon,
    });
  } catch (err) {
    console.error('Coupon issue error:', err);
    return res.status(500).json({
      success: false,
      message: '쿠폰 발급 중 서버 오류가 발생했습니다.',
    });
  }
});

router.post('/claim', async (req, res) => {
  try {
    const userId = normalizeId(req.body.userId);
    const guestId = normalizeId(req.body.guestId);

    if (!userId || !guestId) {
      return res.status(400).json({
        success: false,
        message: 'userId and guestId are required.',
      });
    }

    const result = await Coupon.updateMany(
      { guestId, userId: null },
      { $set: { userId } }
    );

    return res.json({
      success: true,
      claimedCount: result.modifiedCount ?? 0,
    });
  } catch (err) {
    console.error('Coupon claim error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to claim coupons.',
    });
  }
});

router.get('/list/:userId', async (req, res) => {
  try {
    const userId = normalizeId(req.params.userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId가 필요합니다.',
      });
    }

    const coupons = await Coupon.find({ userId }).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      coupons,
    });
  } catch (err) {
    console.error('Coupon list error:', err);
    return res.status(500).json({
      success: false,
      message: '쿠폰 목록 조회 중 서버 오류가 발생했습니다.',
    });
  }
});

export default router;
