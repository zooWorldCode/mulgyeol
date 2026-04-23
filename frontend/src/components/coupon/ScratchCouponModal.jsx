import { useEffect, useMemo, useState } from 'react';
import { getAuthUser } from '../../auth/session.js';
import { issueCoupon } from '../../couponApi.js';
import {
  getCouponGuestId,
  getRewardLabel,
  pickRewardType,
} from '../../utils/couponUtils.js';
import ScratchCard from './ScratchCard.jsx';
import './ScratchCouponModal.css';

const MODAL_DELAY_MS = 3000;
const DISMISSED_KEY = 'scratchCouponModalDismissed';

export default function ScratchCouponModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);

  const rewardType = useMemo(() => pickRewardType(), []);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY) === 'true') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, MODAL_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleComplete() {
    if (loading || coupon) return;

    const user = getAuthUser();
    const userId = user?.id ? String(user.id) : null;
    const guestId = userId ? null : getCouponGuestId();

    setLoading(true);
    setError('');

    try {
      const result = await issueCoupon({ userId, guestId, rewardType });
      setCoupon(result.coupon);
      setRevealed(true);
    } catch {
      setError('쿠폰 발급에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setRevealed(true);
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    sessionStorage.setItem(DISMISSED_KEY, 'true');
    setOpen(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="scratch-coupon" role="presentation">
      <div className="scratch-coupon__overlay" onClick={closeModal} />
      <section
        className="scratch-coupon__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scratch-coupon-title"
      >
        <button
          type="button"
          className="scratch-coupon__close"
          onClick={closeModal}
          aria-label="닫기"
        >
          ×
        </button>

        <p className="scratch-coupon__eyebrow">오늘의 쿠폰</p>
        <h2 id="scratch-coupon-title" className="scratch-coupon__title">
          행운 쿠폰을 확인해보세요
        </h2>

        <ScratchCard onComplete={handleComplete}>
          <div>
            <strong className="scratch-coupon__reward">
              {getRewardLabel(rewardType)}
            </strong>
            <span className="scratch-coupon__hint">
              {loading ? '쿠폰 발급 중...' : '쿠폰 준비 완료'}
            </span>
          </div>
        </ScratchCard>

        {revealed && coupon && (
          <div className="scratch-coupon__issued">
            <span>쿠폰 코드</span>
            <strong>{coupon.couponCode}</strong>
          </div>
        )}

        {revealed && !coupon && error && (
          <p className="scratch-coupon__error">{error}</p>
        )}

        <button
          type="button"
          className="scratch-coupon__button"
          onClick={closeModal}
        >
          확인
        </button>
      </section>
    </div>
  );
}
