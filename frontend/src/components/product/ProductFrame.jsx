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
  hoverImageSrc,
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
  const [baseImgSrc, setBaseImgSrc] = useState(imageSrc);
  const [hovering, setHovering] = useState(false);
  const [hoverImgFailed, setHoverImgFailed] = useState(false);
  const canOpenDetail = Boolean(to) && !product?.listOnly;

  useEffect(() => {
    setBaseImgSrc(imageSrc);
    setHoverImgFailed(false);
  }, [imageSrc, hoverImageSrc]);

  const shouldShowHoverImage = Boolean(
    hovering && hoverImageSrc && !hoverImgFailed
  );
  const renderedImgSrc = shouldShowHoverImage ? hoverImageSrc : baseImgSrc;

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
        const added = addToWishlist(persistProduct);
        setWishTick((t) => t + 1);
        if (added) {
          alert('위시리스트에 추가되었습니다.');
        }
      }
    },
    [onWishlist, product, persistProduct, inWishlist]
  );

  return (
    <article className="product-frame">
      <div className="product-frame__visual">
        {canOpenDetail ? (
          <Link
            to={to}
            className="product-frame__media-link"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {renderedImgSrc ? (
              <img
                src={renderedImgSrc}
                alt=""
                className={
                  'product-frame__img' +
                  (shouldShowHoverImage
                    ? ' product-frame__img--hover'
                    : ' product-frame__img--base')
                }
                loading="lazy"
                onError={() => {
                  if (shouldShowHoverImage) {
                    setHoverImgFailed(true);
                    return;
                  }
                  if (imageSrcFallback && baseImgSrc !== imageSrcFallback) {
                    setBaseImgSrc(imageSrcFallback);
                  }
                }}
              />
            ) : (
              <span className="product-frame__placeholder">No Image</span>
            )}
          </Link>
        ) : (
          <div
            className="product-frame__media-link"
            aria-disabled="true"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {renderedImgSrc ? (
              <img
                src={renderedImgSrc}
                alt=""
                className={
                  'product-frame__img' +
                  (shouldShowHoverImage
                    ? ' product-frame__img--hover'
                    : ' product-frame__img--base')
                }
                loading="lazy"
                onError={() => {
                  if (shouldShowHoverImage) {
                    setHoverImgFailed(true);
                    return;
                  }
                  if (imageSrcFallback && baseImgSrc !== imageSrcFallback) {
                    setBaseImgSrc(imageSrcFallback);
                  }
                }}
              />
            ) : (
              <span className="product-frame__placeholder">No Image</span>
            )}
          </div>
        )}
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
            <svg
              className="product-frame__fab-icon product-frame__fab-icon--wish"
              width="26"
              height="24"
              viewBox="0 0 26 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M24.4961 6.90882C24.5026 3.66505 21.768 1.0293 18.3885 1.02253C15.8626 1.01747 13.6902 2.48294 12.7527 4.57875C11.8236 2.4792 9.65704 1.00505 7.12991 0.999985C3.75299 0.993222 1.00651 3.61799 1.00002 6.86176C0.98114 16.2863 12.7167 22.5494 12.7167 22.5494C12.7167 22.5494 24.4773 16.3334 24.4961 6.90882Z"
                fill={inWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {canOpenDetail ? (
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
      ) : (
        <div className="product-frame__info" aria-disabled="true">
          <h3 className="product-frame__name">{productName}</h3>
          <div className="product-frame__price-row">
            {pct > 0 ? <span className="product-frame__discount">{pct}%</span> : null}
            <span className="product-frame__price-current">{formatWon(sale)}</span>
            {orig != null && orig > sale ? (
              <span className="product-frame__price-original">{formatWon(orig)}</span>
            ) : null}
          </div>
        </div>
      )}
    </article>
  );
}
