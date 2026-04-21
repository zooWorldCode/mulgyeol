import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../cart/cartStorage.js';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../../wishlist/wishlistStorage.js';
import './ProductFrame.css';

const publicUrl = (path) => {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${base}${path.replace(/^\//, '')}`;
};
const ICON_CART = publicUrl('images/icon/cart.svg');
const ICON_WISHLIST = publicUrl('images/icon/wishlist.svg');

function formatWon(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return String(n);
  return `${v.toLocaleString('ko-KR')}원`;
}

export default function ProductFrame({
  to,
  product,
  imageSrc,
  imageSrcFallback,
  /** 장바구니·위시리스트 저장 시 사용할 썸네일 URL (예: 카테고리에서 해석한 목록 이미지) */
  thumbSrc,
  productName,
  currentPrice,
  originalPrice,
  discountPercent,
  onAddToCart,
  onWishlist,
}) {
  const navigate = useNavigate();
  const [wishTick, setWishTick] = useState(0);
  const [imgSrc, setImgSrc] = useState(imageSrc);

  useEffect(() => {
    setImgSrc(imageSrc);
  }, [imageSrc]);

  const persistProduct = useMemo(() => {
    if (!product?._id) return null;
    const img =
      thumbSrc ||
      (Array.isArray(product.images) && product.images.find(Boolean)) ||
      product.image ||
      '';
    return { ...product, image: img };
  }, [product, thumbSrc]);

  const inWishlist = useMemo(() => {
    void wishTick;
    if (!product?._id) return false;
    const id = String(product._id);
    return getWishlist().some((p) => String(p._id) === id);
  }, [product, wishTick]);

  const sale = Number(currentPrice) || 0;
  const orig = originalPrice != null ? Number(originalPrice) : null;
  const pct =
    discountPercent != null && Number.isFinite(Number(discountPercent))
      ? Math.round(Number(discountPercent))
      : orig != null && orig > sale
        ? Math.round(((orig - sale) / orig) * 100)
        : 0;

  const handleCart = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onAddToCart) {
        onAddToCart(e);
        return;
      }
      if (persistProduct) {
        addToCart(persistProduct, 1, '');
        navigate('/cart');
      }
    },
    [onAddToCart, persistProduct, navigate]
  );

  const handleWish = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onWishlist) {
        onWishlist(e);
        return;
      }
      if (!product?._id) return;
      if (inWishlist) {
        removeFromWishlist(product._id);
        setWishTick((t) => t + 1);
        return;
      }
      if (persistProduct) {
        addToWishlist(persistProduct);
        setWishTick((t) => t + 1);
        navigate('/wishlist');
      }
    },
    [onWishlist, product, persistProduct, inWishlist]
  );

  return (
    <article className="product-frame">
      <div className="product-frame__visual">
        <Link to={to} className="product-frame__media-link">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt=""
              className="product-frame__img"
              loading="lazy"
              onError={() => {
                if (imageSrcFallback && imgSrc !== imageSrcFallback) {
                  setImgSrc(imageSrcFallback);
                }
              }}
            />
          ) : (
            <span className="product-frame__placeholder">No Image</span>
          )}
        </Link>
        <div className="product-frame__fab">
          <button
            type="button"
            className="product-frame__fab-btn"
            aria-label="장바구니 담기"
            onClick={handleCart}
          >
            <img src={ICON_CART} alt="" className="product-frame__fab-icon" width={22} height={24} />
          </button>
          <button
            type="button"
            className={`product-frame__fab-btn${inWishlist ? ' product-frame__fab-btn--wish-on' : ''}`}
            aria-label={inWishlist ? '찜 해제' : '찜하기'}
            onClick={handleWish}
          >
            <img src={ICON_WISHLIST} alt="" className="product-frame__fab-icon" width={22} height={20} />
          </button>
        </div>
      </div>
      <Link to={to} className="product-frame__info">
        <h3 className="product-frame__name">{productName}</h3>
        <div className="product-frame__price-row">
          {pct > 0 ? <span className="product-frame__discount">{pct}%</span> : null}
          <span className="product-frame__price-current">{formatWon(sale)}</span>
          {orig != null && orig > sale ? (
            <span className="product-frame__price-original">{formatWon(orig)}</span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
