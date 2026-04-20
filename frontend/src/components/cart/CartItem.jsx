/**
 * @param {{
 *   line: { productId: string; name: string; price: number; image: string; quantity: number; option?: string };
 *   onRemove: () => void;
 *   onQuantityChange: (nextQty: number) => void;
 * }} props
 */
export default function CartItem({ line, onRemove, onQuantityChange }) {
  const lineTotal = Number(line.price) * Number(line.quantity);

  return (
    <article
      className="cart-item"
      style={{
        borderBottom: '1px solid var(--shadow-bright)',
        paddingBottom: 16,
        marginBottom: 16,
      }}
    >
      <div
        className="cart-item__layout"
        style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
      >
        <div className="cart-item__image-wrap">
          {line.image ? (
            <img
              src={line.image}
              alt=""
              className="cart-item__image"
              style={{ width: 80, height: 80, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="cart-item__image-placeholder"
              style={{
                width: 80,
                height: 80,
                background: 'var(--shadow-bright)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              No Image
            </div>
          )}
        </div>
        <div className="cart-item__body">
          <h3 className="cart-item__name">{line.name}</h3>
          {line.option ? (
            <p className="cart-item__option">옵션: {line.option}</p>
          ) : null}
          <p className="cart-item__unit-price">
            단가 {Number(line.price).toLocaleString()}원
          </p>
          <p className="cart-item__line-total">
            소계 {lineTotal.toLocaleString()}원
          </p>
          <div
            className="cart-item__controls"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <div className="cart-item__qty" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                className="cart-item__qty-btn cart-item__qty-btn--dec"
                onClick={() => onQuantityChange(line.quantity - 1)}
                disabled={line.quantity <= 1}
                aria-label="수량 감소"
              >
                −
              </button>
              <span className="cart-item__qty-value">{line.quantity}</span>
              <button
                type="button"
                className="cart-item__qty-btn cart-item__qty-btn--inc"
                onClick={() => onQuantityChange(line.quantity + 1)}
                aria-label="수량 증가"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="cart-item__remove"
              onClick={onRemove}
              aria-label="삭제"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
