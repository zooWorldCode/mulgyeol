/**
 * @param {{
 *   value: number;
 *   onChange: (n: number) => void;
 *   min?: number;
 *   className?: string;
 *   showLabel?: boolean;
 * } & import('react').HTMLAttributes<HTMLDivElement>} props
 */
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  className = '',
  showLabel = true,
  ...rest
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(value + 1);

  return (
    <div className={`product-quantity-selector ${className}`.trim()} {...rest}>
      {showLabel ? (
        <>
          <span className="product-quantity-selector__label">수량</span>{' '}
        </>
      ) : null}
      <div className="product-quantity-selector__controls">
        <button
          type="button"
          className="product-quantity-selector__btn product-quantity-selector__btn--dec"
          onClick={dec}
          disabled={value <= min}
          aria-label="수량 감소"
        >
          −
        </button>
        <span className="product-quantity-selector__value">{value}</span>
        <button
          type="button"
          className="product-quantity-selector__btn product-quantity-selector__btn--inc"
          onClick={inc}
          aria-label="수량 증가"
        >
          +
        </button>
      </div>
    </div>
  );
}
