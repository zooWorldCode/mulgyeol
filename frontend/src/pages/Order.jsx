import { Link, useLocation } from 'react-router-dom';

export default function Order() {
  const { state } = useLocation();

  if (state?.cartCheckout) {
    return (
      <div className="order-page">
        <h1 className="order-page__title">주문</h1>
        <div className="order-page__summary">
          <p>장바구니 주문</p>
          <ul>
            {(state.lines || []).map((line) => (
              <li key={`${line.productId}::${line.option ?? ''}`}>
                {line.name}
                {line.option ? ` (${line.option})` : ''} ·{' '}
                {line.quantity}개 ·{' '}
                {(Number(line.price) * Number(line.quantity)).toLocaleString()}원
              </li>
            ))}
          </ul>
          <p>상품 금액: {(state.subtotal ?? 0).toLocaleString()}원</p>
          <p>할인: -{(state.couponDiscount ?? 0).toLocaleString()}원</p>
          <p>포인트: -{(state.pointDiscount ?? 0).toLocaleString()}원</p>
          <p>배송비: {(state.shipping ?? 0).toLocaleString()}원</p>
          <p>
            <strong>
              최종 {(state.finalAmount ?? 0).toLocaleString()}원
            </strong>
          </p>
          <p style={{ fontSize: 14, color: '#666' }}>
            결제·배송 입력 폼은 추후 연결 예정입니다.
          </p>
        </div>
        <p>
          <Link to="/cart">← 장바구니</Link>
        </p>
      </div>
    );
  }

  if (state?.product) {
    return (
      <div className="order-page">
        <h1 className="order-page__title">주문</h1>
        <div className="order-page__summary">
          <p>바로 구매 상품</p>
          <ul>
            <li>상품명: {state.product.name}</li>
            <li>옵션: {state.option || '기본'}</li>
            <li>수량: {state.qty}</li>
            <li>합계: {(state.totalPrice ?? 0).toLocaleString()}원</li>
          </ul>
          <p style={{ fontSize: 14, color: '#666' }}>
            결제·배송 입력 폼은 추후 연결 예정입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h1 className="order-page__title">주문</h1>
      <p>
        주문할 상품 정보가 없습니다.{' '}
        <Link to="/category">쇼핑 계속하기</Link>
      </p>
    </div>
  );
}
