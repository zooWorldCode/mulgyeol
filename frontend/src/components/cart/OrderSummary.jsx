import './OrderSummary.css';

/**
 * @param {{
 *   subtotal: number;
 *   couponDiscount: number;
 *   pointDiscount: number;
 *   shipping: number;
 *   finalAmount: number;
 * }} props
 */
export default function OrderSummary({
  subtotal,
  couponDiscount,
  pointDiscount,
  shipping,
  finalAmount,
}) {
  function fmt(n) {
    return `${Number(n || 0).toLocaleString('ko-KR')} 원`;
  }

  return (
    <div className="order-summary">
      <h2 className="order-summary__heading">주문금액</h2>
      <dl className="order-summary__rows">
        <div className="order-summary__row">
          <dt className="order-summary__label">상품 금액</dt>
          <dd className="order-summary__value">{fmt(subtotal)}</dd>
        </div>
        <div className="order-summary__row">
          <dt className="order-summary__label">할인 금액</dt>
          <dd className="order-summary__value">
            {couponDiscount > 0
              ? `-${Number(couponDiscount).toLocaleString('ko-KR')} 원`
              : fmt(0)}
          </dd>
        </div>
        <div className="order-summary__row">
          <dt className="order-summary__label">배송비</dt>
          <dd className="order-summary__value">{fmt(shipping)}</dd>
        </div>
        <div className="order-summary__row">
          <dt className="order-summary__label">포인트 사용</dt>
          <dd className="order-summary__value">
            {pointDiscount > 0
              ? `-${Number(pointDiscount).toLocaleString('ko-KR')} 원`
              : fmt(0)}
          </dd>
        </div>
      </dl>
      <hr className="order-summary__rule" />
      <div className="order-summary__final">
        <span className="order-summary__final-label">최종 결제 금액</span>
        <span className="order-summary__final-value">{fmt(finalAmount)}</span>
      </div>
    </div>
  );
}
