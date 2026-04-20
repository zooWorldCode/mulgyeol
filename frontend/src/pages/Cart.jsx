import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import CouponForm from '../components/cart/CouponForm.jsx';
import PointToggle from '../components/cart/PointToggle.jsx';
import {
  getCartLines,
  removeCartLine,
  updateCartLineQuantity,
} from '../cart/cartStorage.js';

const DUMMY_POINT_BALANCE = 12000;
const SHIPPING_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 50000;

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
    updateCartLineQuantity(line.productId, line.option, nextQty);
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
      <h1 className="cart-page__title">장바구니</h1>

      {empty ? (
        <p className="cart-page__empty">장바구니에 담긴 상품이 없습니다.</p>
      ) : (
        <div
          className="cart-page__grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            alignItems: 'flex-start',
          }}
        >
          <section className="cart-page__col cart-page__col--list">
            <div className="cart-page__list">
              {lines.map((line) => (
                <CartItem
                  key={`${line.productId}::${line.option ?? ''}`}
                  line={line}
                  onRemove={() => handleRemove(line)}
                  onQuantityChange={(q) =>
                    handleQty(line, Math.max(1, q))
                  }
                />
              ))}
            </div>
          </section>

          <section className="cart-page__col cart-page__col--side">
            <CartSummary
              subtotal={subtotal}
              couponDiscount={couponDiscount}
              pointDiscount={pointDiscount}
              shipping={shipping}
              finalAmount={finalAmount}
            />

            <div style={{ marginTop: 20 }}>
              <CouponForm
                appliedCode={appliedCouponCode}
                onApply={handleApplyCoupon}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <PointToggle
                balance={DUMMY_POINT_BALANCE}
                enabled={pointEnabled}
                onChange={setPointEnabled}
              />
            </div>

            <div
              className="cart-page__checkout-wrap"
              style={{ marginTop: 24, textAlign: 'right' }}
            >
              <button
                type="button"
                className="cart-page__checkout-btn"
                onClick={handleOrder}
                disabled={empty}
              >
                주문결제
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
