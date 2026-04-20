import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../cart/cartStorage.js';
import { addToWishlist } from '../../wishlist/wishlistStorage.js';
import { getDefaultOptions, getPricing } from '../../utils/productNormalize.js';
import QuantitySelector from './QuantitySelector.jsx';

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

  const unitPrice = sale;
  const totalPrice = unitPrice * qty;

  const rating = Number(product.rating) || 0;
  const reviewCount = Number(product.reviewCount) || 0;
  const subtitle =
    product.subtitle || product.description?.slice(0, 80) || '';

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
      {subtitle ? (
        <p className="product-info__subtitle">{subtitle}</p>
      ) : null}

      <div className="product-info__rating-row">
        <span className="product-info__rating-stars" aria-hidden>
          ★
        </span>
        <span className="product-info__rating-value">
          {rating.toFixed(1)}
        </span>
        <span className="product-info__review-count">
          리뷰 {reviewCount}건
        </span>
      </div>

      <div className="product-info__price-block">
        <div className="product-info__price-row">
          <span className="product-info__label">정가</span>
          <span
            className="product-info__original-price"
            style={{ textDecoration: 'line-through', color: '#888' }}
          >
            {original.toLocaleString()}원
          </span>
        </div>
        <div className="product-info__price-row">
          <span className="product-info__label">판매가</span>
          <strong className="product-info__sale-price">
            {sale.toLocaleString()}원
          </strong>
        </div>
        <div className="product-info__price-row">
          <span className="product-info__label">할인율</span>
          <span className="product-info__discount-rate">{discountRate}%</span>
        </div>
      </div>

      <p className="product-info__shipping">{product.shippingNote}</p>

      <div className="product-info__field">
        <label className="product-info__label" htmlFor="product-option">
          옵션
        </label>
        <select
          id="product-option"
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

      <div className="product-info__field">
        <QuantitySelector value={qty} onChange={setQty} min={1} />
      </div>

      <div className="product-info__total">
        <span className="product-info__total-label">총 상품금액</span>{' '}
        <strong className="product-info__total-price">
          {totalPrice.toLocaleString()}원
        </strong>
      </div>

      <div className="product-info__actions">
        <button
          type="button"
          className="product-info__btn product-info__btn--buy"
          onClick={handleBuyNow}
        >
          바로 구매
        </button>
        <button
          type="button"
          className="product-info__btn product-info__btn--cart"
          onClick={handleAddCart}
        >
          장바구니
        </button>
        <button
          type="button"
          className="product-info__btn product-info__btn--wish"
          onClick={handleWishlist}
        >
          찜하기
        </button>
      </div>
    </div>
  );
}
