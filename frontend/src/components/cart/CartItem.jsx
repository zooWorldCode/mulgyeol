import { useMemo } from 'react';
import { getPricing } from '../../utils/productNormalize.js';
import './CartItem.css';

/**
 * @param {{
 *   line: { productId: string; name: string; price: number; image: string; quantity: number; option?: string };
 *   onRemove: () => void;
 *   onQuantityChange: (nextQty: number) => void;
 * }} props
 */
export default function CartItem({ line, onRemove, onQuantityChange }) {
  const qty = Number(line.quantity) || 1;
  const { sale, original, discountRate } = useMemo(
    () => getPricing({ price: line.price }),
    [line.price]
  );

  const unitOriginal = original != null ? original : sale;
  const lineOriginal = unitOriginal * qty;
  const lineSale = sale * qty;

  return (
    <article className="cart-item">
      <div className="cart-item__grid">
        <div className="cart-item__thumb">
          {line.image ? (
            <img src={line.image} alt="" className="cart-item__thumb-img" />
          ) : (
            <div className="cart-item__thumb-placeholder">No Image</div>
          )}
        </div>

        <div className="cart-item__qty">
          <button
            type="button"
            className="cart-item__qty-btn"
            onClick={() => onQuantityChange(qty - 1)}
            disabled={qty <= 1}
            aria-label="수량 감소"
          >
            -
          </button>
          <span className="cart-item__qty-value">{qty}</span>
          <button
            type="button"
            className="cart-item__qty-btn"
            onClick={() => onQuantityChange(qty + 1)}
            aria-label="수량 증가"
          >
            +
          </button>
        </div>

        <div className="cart-item__info">
          <h3 className="cart-item__name">{line.name}</h3>
          {line.option ? <p className="cart-item__option">{line.option}</p> : null}
        </div>

        <div className="cart-item__price-block">
          {unitOriginal > sale ? (
            <p className="cart-item__original">
              {lineOriginal.toLocaleString('ko-KR')}원
            </p>
          ) : null}
          <p className="cart-item__sale">
            {lineSale.toLocaleString('ko-KR')}원
          </p>
          {discountRate > 0 ? (
            <span className="cart-item__badge">{discountRate}% 할인</span>
          ) : null}
        </div>

        <div className="cart-item__footer">
          <button
            type="button"
            className="cart-item__remove"
            onClick={onRemove}
            aria-label="삭제"
          >
            <img
              src="/images/icon/close.png"
              alt=""
              className="cart-item__remove-icon"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
