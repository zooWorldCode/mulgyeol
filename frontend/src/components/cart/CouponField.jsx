import { useState } from 'react';
import './CouponField.css';

/**
 * @param {{
 *   appliedCode: string | null;
 *   onApply: (code: string) => void;
 * }} props
 */
export default function CouponField({ appliedCode, onApply }) {
  const [input, setInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onApply(input.trim());
  }

  return (
    <div className="coupon-field">
      <h3 className="coupon-field__title">쿠폰 코드</h3>
      <form className="coupon-field__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="coupon-field__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="쿠폰 코드 입력"
          aria-label="쿠폰 코드"
        />
        <button type="submit" className="coupon-field__apply">
          적용
        </button>
      </form>
      {appliedCode ? (
        <p className="coupon-field__status">적용됨: {appliedCode}</p>
      ) : (
        <p className="coupon-field__hint">예: SAVE10 입력 시 상품 금액의 10% 할인</p>
      )}
    </div>
  );
}
