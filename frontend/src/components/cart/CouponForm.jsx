import { useState } from 'react';

/**
 * @param {{
 *   appliedCode: string | null;
 *   onApply: (code: string) => void;
 * }} props
 */
export default function CouponForm({ appliedCode, onApply }) {
  const [input, setInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onApply(input.trim());
  }

  return (
    <div className="coupon-form">
      <h3 className="coupon-form__title">쿠폰 코드</h3>
      <form
        className="coupon-form__form"
        onSubmit={handleSubmit}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
      >
        <input
          type="text"
          className="coupon-form__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="쿠폰 코드 입력"
          aria-label="쿠폰 코드"
          style={{ flex: '1 1 160px', minWidth: 0 }}
        />
        <button type="submit" className="coupon-form__apply-btn">
          적용
        </button>
      </form>
      {appliedCode ? (
        <p className="coupon-form__status">적용됨: {appliedCode}</p>
      ) : (
        <p className="coupon-form__hint" style={{ fontSize: 13, color: '#666' }}>
          예: SAVE10 입력 시 상품 금액의 10% 할인
        </p>
      )}
    </div>
  );
}
