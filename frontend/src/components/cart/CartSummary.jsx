/**
 * @param {{
 *   subtotal: number;
 *   couponDiscount: number;
 *   pointDiscount: number;
 *   shipping: number;
 *   finalAmount: number;
 * }} props
 */
export default function CartSummary({
  subtotal,
  couponDiscount,
  pointDiscount,
  shipping,
  finalAmount,
}) {
  function fmt(n) {
    return `${Number(n || 0).toLocaleString()}원`;
  }

  return (
    <aside
      className="cart-summary"
      style={{
        border: '1px solid #ddd',
        padding: 16,
        borderRadius: 4,
      }}
    >
      <h2 className="cart-summary__title" style={{ marginTop: 0 }}>
        주문금액
      </h2>
      <div className="cart-summary__rows">
        <div
          className="cart-summary__row cart-summary__row--subtotal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span className="cart-summary__label">상품 금액</span>
          <span className="cart-summary__amount">{fmt(subtotal)}</span>
        </div>
        <div
          className="cart-summary__row cart-summary__row--discount"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span className="cart-summary__label">할인 금액</span>
          <span className="cart-summary__amount">
            {couponDiscount > 0
              ? `-${Number(couponDiscount).toLocaleString()}원`
              : fmt(0)}
          </span>
        </div>
        <div
          className="cart-summary__row cart-summary__row--point"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span className="cart-summary__label">포인트 사용</span>
          <span className="cart-summary__amount">
            {pointDiscount > 0
              ? `-${Number(pointDiscount).toLocaleString()}원`
              : fmt(0)}
          </span>
        </div>
        <div
          className="cart-summary__row cart-summary__row--shipping"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span className="cart-summary__label">배송비</span>
          <span className="cart-summary__amount">{fmt(shipping)}</span>
        </div>
      </div>
      <hr className="cart-summary__divider" />
      <div
        className="cart-summary__row cart-summary__row--final"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          marginTop: 8,
        }}
      >
        <span className="cart-summary__label">최종 결제 금액</span>
        <span className="cart-summary__amount cart-summary__amount--final">
          {fmt(finalAmount)}
        </span>
      </div>
    </aside>
  );
}
