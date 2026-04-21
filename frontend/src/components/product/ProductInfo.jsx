import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../cart/cartStorage.js';
import { addToWishlist } from '../../wishlist/wishlistStorage.js';
import { getDefaultOptions, getPricing } from '../../utils/productNormalize.js';
import QuantitySelector from './QuantitySelector.jsx';
import './ProductInfo.css';

const FREE_SHIPPING_THRESHOLD = 30000;
const SHIPPING_FEE = 3000;

function StarRow({ rating, max = 5 }) {
  const filled = Math.min(max, Math.round(Math.max(0, Math.min(max, Number(rating) || 0))));
  return (
    <span className="product-info__stars" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={
            i < filled ? 'product-info__star product-info__star--on' : 'product-info__star'
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}

/**
 * @param {{ product: object }} props
 */
export default function ProductInfo({ product }) {
  const navigate = useNavigate();
  const options = useMemo(() => getDefaultOptions(product), [product]);
  const [selectedOption, setSelectedOption] = useState(options[0] || '기본');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const opts = getDefaultOptions(product);
    setSelectedOption(opts[0] || '기본');
    setQty(1);
  }, [product._id]);

  const { sale, original, discountRate } = useMemo(
    () => getPricing(product),
    [product]
  );

  const totalPrice = sale * qty;

  const rating = Number(product.rating) || 0;
  const reviewCount = Number(product.reviewCount) || 0;
  const subtitle =
    product.subtitle ||
    (typeof product.description === 'string'
      ? product.description.slice(0, 80)
      : '') ||
    '';

  const pointsPreview = Math.max(0, Math.floor(sale * qty * 0.01));
  const shippingLine1 = `구매 적립 ${pointsPreview.toLocaleString('ko-KR')}P`;
  const shippingLine2 =
    product.shippingNote ||
    `${(FREE_SHIPPING_THRESHOLD / 10000).toFixed(0)}만원 이상 무료배송 · 그 외 배송비 ${SHIPPING_FEE.toLocaleString('ko-KR')}원`;

  function handleBuyNow() {
    navigate('/order', {
      state: {
        product,
        qty,
        option: selectedOption,
        totalPrice,
      },
    });
  }

  function handleAddCart() {
    const ok = addToCart(product, qty, selectedOption);
    alert(ok ? '장바구니에 담았습니다.' : '이미 장바구니에 있는 상품입니다.');
  }

  function handleWishlist() {
    const ok = addToWishlist(product);
    alert(ok ? '위시리스트에 담았습니다.' : '이미 위시리스트에 있습니다.');
  }

  return (
    <div className="product-info">
      <h1 className="product-info__title">{product.name}</h1>
      {subtitle ? <p className="product-info__subtitle">{subtitle}</p> : null}

      <div className="product-info__rating-row">
        <StarRow rating={rating} />
        <span className="product-info__rating-value">{rating.toFixed(1)}</span>
        <span className="product-info__review-participants">
          {reviewCount.toLocaleString('ko-KR')}명 참여
        </span>
      </div>

      <hr className="product-info__rule" />

      <div className="product-info__price-line">
        {original > sale ? (
          <del className="product-info__original">
            {original.toLocaleString('ko-KR')}원
          </del>
        ) : null}
        <strong className="product-info__sale">{sale.toLocaleString('ko-KR')}원</strong>
        {discountRate > 0 ? (
          <span className="product-info__badge">{discountRate}% 할인</span>
        ) : null}
      </div>

      <div className="product-info__meta">
        <p className="product-info__meta-line">{shippingLine1}</p>
        <p className="product-info__meta-line">{shippingLine2}</p>
      </div>

      <hr className="product-info__rule" />

      <div className="product-info__option-block">
        <label className="product-info__option-label" htmlFor="product-detail-option">
          상품 선택
        </label>
        <div className="product-info__select-shell">
          <select
            id="product-detail-option"
            className="product-info__select"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="product-info__qty-block">
        <span className="product-info__option-label" id="product-detail-qty-label">
          수량
        </span>
        <QuantitySelector
          value={qty}
          onChange={setQty}
          min={1}
          showLabel={false}
          className="product-quantity-selector--compact"
          aria-labelledby="product-detail-qty-label"
        />
      </div>

      <div className="product-info__actions">
        <button
          type="button"
          className="product-info__btn product-info__btn--buy"
          onClick={handleBuyNow}
        >
          바로 구매
        </button>
        <div className="product-info__actions-row2">
          <button
            type="button"
            className="product-info__btn product-info__btn--secondary"
            onClick={handleAddCart}
          >
            장바구니
          </button>
          <button
            type="button"
            className="product-info__btn product-info__btn--secondary"
            onClick={handleWishlist}
          >
            찜하기
          </button>
        </div>
      </div>
    </div>
  );
}
