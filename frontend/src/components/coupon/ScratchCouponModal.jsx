import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
const MODAL_SESSION_KEY = 'scratchCouponModalDismissedSession';
const MODAL_HIDE_KEY = 'scratchCouponModalHideUntil';

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shouldHideModalToday() {
  return localStorage.getItem(MODAL_HIDE_KEY) === getTodayKey();
}

export default function ScratchCouponModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [hideToday, setHideToday] = useState(false);

  const rewardType = useMemo(() => pickRewardType(), []);
  const user = getAuthUser();
  const isLoggedIn = Boolean(user?.id);

  useEffect(() => {
    if (sessionStorage.getItem(MODAL_SESSION_KEY) === 'true') {
      return undefined;
    }

    if (shouldHideModalToday()) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, MODAL_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleComplete() {
    if (loading || coupon) return;

    const userId = user?.id ? String(user.id) : null;
    const guestId = userId ? null : getCouponGuestId();

    setLoading(true);
    setError('');

    try {
      const result = await issueCoupon({ userId, guestId, rewardType });
      setCoupon(result.coupon ?? null);
      setRevealed(true);
    } catch {
      setError('쿠폰 발급에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setRevealed(true);
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    sessionStorage.setItem(MODAL_SESSION_KEY, 'true');

    if (hideToday) {
      localStorage.setItem(MODAL_HIDE_KEY, getTodayKey());
    }

    setOpen(false);
  }

  function goToAuth(path) {
    setOpen(false);
    navigate(`${path}?redirect=/mypage`);
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
          스크래치 쿠폰을 긁고 혜택을 확인해 보세요
        </h2>

        <ScratchCard onComplete={handleComplete}>
          <div>
            <strong className="scratch-coupon__reward">
              {getRewardLabel(rewardType)}
            </strong>
            <span className="scratch-coupon__hint">
              {loading ? '쿠폰을 확인하는 중입니다.' : '오늘의 혜택이 준비되어 있어요'}
            </span>
          </div>
        </ScratchCard>

        {revealed && coupon && isLoggedIn && (
          <div className="scratch-coupon__issued">
            <span>쿠폰 코드</span>
            <strong>{coupon.couponCode}</strong>
          </div>
        )}

        {revealed && coupon && !isLoggedIn && (
          <div className="scratch-coupon__auth-box">
            <strong className="scratch-coupon__auth-title">
              쿠폰이 담겼어요
            </strong>
            <p className="scratch-coupon__auth-text">
              로그인하거나 회원가입하면 마이페이지에서 쿠폰을 확인할 수 있어요.
            </p>
            <div className="scratch-coupon__auth-actions">
              <button
                type="button"
                className="scratch-coupon__auth-button scratch-coupon__auth-button--primary"
                onClick={() => goToAuth('/login')}
              >
                로그인 하기
              </button>
              <button
                type="button"
                className="scratch-coupon__auth-button scratch-coupon__auth-button--secondary"
                onClick={() => goToAuth('/signup')}
              >
                회원가입하기
              </button>
            </div>
          </div>
        )}

        {revealed && !coupon && error && (
          <p className="scratch-coupon__error">{error}</p>
        )}

        {!revealed || !coupon || !isLoggedIn ? null : (
          <button
            type="button"
            className="scratch-coupon__button"
            onClick={closeModal}
          >
            확인
          </button>
        )}

        <label className="scratch-coupon__hide-today">
          <input
            type="checkbox"
            checked={hideToday}
            onChange={(event) => setHideToday(event.target.checked)}
          />
          오늘 하루 안 보이기
        </label>
      </section>
    </div>
  );
}
