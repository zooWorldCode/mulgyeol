import { Link } from 'react-router-dom';
import './ProductThumbnail.css';

function formatPrice(price) {
  const n = typeof price === 'number' ? price : Number(price);
  if (!Number.isFinite(n)) return String(price);
  return `${n.toLocaleString('ko-KR')}원`;
}

/** `to`가 있으면 `<Link>`, 없으면 `<div>` (썸네일만). */
export default function ProductThumbnail({ to, image, name, price, className = '' }) {
  const rootClass = ['product-thumbnail', className].filter(Boolean).join(' ');

  const body = (
    <>
      <div className="product-thumbnail__media">
        {image ? (
          <img src={image} alt="" className="product-thumbnail__img" loading="lazy" />
        ) : (
          <span className="product-thumbnail__placeholder">No Image</span>
        )}
      </div>
      <div className="product-thumbnail__name">{name}</div>
      <div className="product-thumbnail__price">{formatPrice(price)}</div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={rootClass}>
        {body}
      </Link>
    );
  }

  return <div className={rootClass}>{body}</div>;
}
