import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartList from '../components/cart/CartList.jsx';
import OrderSummary from '../components/cart/OrderSummary.jsx';
import CouponField from '../components/cart/CouponField.jsx';
import PointToggle from '../components/cart/PointToggle.jsx';
import {
  getCartLines,
  removeCartLine,
  updateCartLineQuantity,
} from '../cart/cartStorage.js';
import PageWideBand from '../components/common/PageWideBand.jsx';
import './Cart.css';

const DUMMY_POINT_BALANCE = 12000;
const SHIPPING_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 30000;

function computeSubtotal(lines) {
  return lines.reduce(
    (sum, line) => sum + Number(line.price) * Number(line.quantity),
    0
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);
  const [pointEnabled, setPointEnabled] = useState(false);

  const lines = useMemo(() => {
    void tick;
    return getCartLines();
  }, [tick]);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    const onCartUpdated = () => setTick((t) => t + 1);
    window.addEventListener('shopmall-cart-updated', onCartUpdated);
    return () => window.removeEventListener('shopmall-cart-updated', onCartUpdated);
  }, []);

  const subtotal = useMemo(() => computeSubtotal(lines), [lines]);

  const couponDiscount = useMemo(() => {
    if (appliedCouponCode === 'SAVE10') {
      return Math.floor(subtotal * 0.1);
    }
    return 0;
  }, [appliedCouponCode, subtotal]);

  const afterCoupon = subtotal - couponDiscount;

  const pointDiscount = useMemo(() => {
    if (!pointEnabled) return 0;
    return Math.min(DUMMY_POINT_BALANCE, Math.max(0, afterCoupon));
  }, [pointEnabled, afterCoupon]);

  const afterDiscounts = subtotal - couponDiscount - pointDiscount;

  const shipping = useMemo(() => {
    return afterDiscounts >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  }, [afterDiscounts]);

  const finalAmount = afterDiscounts + shipping;

  function handleApplyCoupon(code) {
    if (!code) {
      setAppliedCouponCode(null);
      return;
    }
    if (code.toUpperCase() === 'SAVE10') {
      setAppliedCouponCode('SAVE10');
    } else {
      setAppliedCouponCode(null);
      alert('적용 가능한 쿠폰이 아닙니다. (예: SAVE10)');
    }
  }

  function handleRemove(line) {
    removeCartLine(line.productId, line.option);
    refresh();
  }

  function handleQty(line, nextQty) {
    updateCartLineQuantity(
      line.productId,
      line.option,
      Math.max(1, Number(nextQty) || 1)
    );
    refresh();
  }

  function handleOrder() {
    navigate('/order', {
      state: {
        cartCheckout: true,
        lines,
        subtotal,
        couponDiscount,
        pointDiscount,
        shipping,
        finalAmount,
        appliedCouponCode,
        pointEnabled,
      },
    });
  }

  const empty = lines.length === 0;

  return (
    <div className="cart-page">
      <PageWideBand text="장바구니" />

      {empty ? (
        <p className="cart-page__empty">장바구니에 담긴 상품이 없습니다.</p>
      ) : (
        <div className="cart-page__layout">
          <section className="cart-page__main" aria-label="장바구니 상품">
            <CartList
              lines={lines}
              onRemove={handleRemove}
              onQuantityChange={handleQty}
            />
          </section>

          <aside className="cart-page__aside" aria-label="주문 요약">
            <OrderSummary
              subtotal={subtotal}
              couponDiscount={couponDiscount}
              pointDiscount={pointDiscount}
              shipping={shipping}
              finalAmount={finalAmount}
            />
            <CouponField
              appliedCode={appliedCouponCode}
              onApply={handleApplyCoupon}
            />
            <PointToggle
              balance={DUMMY_POINT_BALANCE}
              enabled={pointEnabled}
              onChange={setPointEnabled}
            />
            <button
              type="button"
              className="cart-page__checkout"
              onClick={handleOrder}
              disabled={empty}
            >
              주문 결제
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
