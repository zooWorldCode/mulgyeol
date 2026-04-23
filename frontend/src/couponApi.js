import api from './api.js';

export async function issueCoupon({ userId, guestId, rewardType }) {
  try {
    const { data } = await api.post('/api/coupon/issue', {
      userId,
      guestId,
      rewardType,
    });

    return data;
  } catch (err) {
    if (err.response?.status === 409) {
      return err.response.data;
    }

    throw err;
  }
}

export async function getCouponList(userId) {
  const { data } = await api.get(`/api/coupon/list/${userId}`);
  return data;
}
