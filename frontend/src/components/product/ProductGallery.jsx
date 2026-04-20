import { useEffect, useState } from 'react';

const THUMB_VISIBLE = 5;

/**
 * @param {{ images: string[]; productName: string }} props
 */
export default function ProductGallery({ images, productName }) {
  const [mainIndex, setMainIndex] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);

  const list = images.length ? images : [];
  const hasImages = list.length > 0;

  useEffect(() => {
    setMainIndex(0);
    setThumbOffset(0);
  }, [images.join('|')]);

  useEffect(() => {
    if (mainIndex < thumbOffset) {
      setThumbOffset(mainIndex);
    } else if (mainIndex >= thumbOffset + THUMB_VISIBLE) {
      setThumbOffset(mainIndex - THUMB_VISIBLE + 1);
    }
  }, [mainIndex]);

  const visibleThumbs = hasImages
    ? list.slice(thumbOffset, thumbOffset + THUMB_VISIBLE)
    : [];

  const maxThumbOffset = Math.max(0, list.length - THUMB_VISIBLE);
  const canUp = thumbOffset > 0;
  const canDown = hasImages && thumbOffset < maxThumbOffset;

  const mainSrc = hasImages ? list[mainIndex] : null;

  return (
    <div className="product-gallery">
      {hasImages ? (
        <div
          className="product-gallery__layout"
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
          }}
        >
          <div
            className="product-gallery__thumbs-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <button
              type="button"
              className="product-gallery__scroll-btn product-gallery__scroll-btn--up"
              onClick={() => setThumbOffset((o) => Math.max(0, o - 1))}
              disabled={!canUp}
              aria-label="썸네일 위로"
            >
              ↑
            </button>
            <ul
              className="product-gallery__thumbs-list"
              role="listbox"
              aria-label="상품 썸네일"
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {visibleThumbs.map((src, i) => {
                const idx = thumbOffset + i;
                const active = idx === mainIndex;
                return (
                  <li key={`${src}-${idx}`} className="product-gallery__thumb-item">
                    <button
                      type="button"
                      className={
                        'product-gallery__thumb' +
                        (active ? ' product-gallery__thumb--active' : '')
                      }
                      onClick={() => setMainIndex(idx)}
                      aria-current={active ? 'true' : undefined}
                      style={{
                        padding: 2,
                        border: active ? '2px solid #333' : '1px solid #ccc',
                        background: '#fff',
                        cursor: 'pointer',
                        width: 56,
                        height: 56,
                      }}
                    >
                      <img
                        src={src}
                        alt=""
                        className="product-gallery__thumb-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="product-gallery__scroll-btn product-gallery__scroll-btn--down"
              onClick={() =>
                setThumbOffset((o) => Math.min(maxThumbOffset, o + 1))
              }
              disabled={!canDown}
              aria-label="썸네일 아래로"
            >
              ↓
            </button>
          </div>
          <div
            className="product-gallery__main"
            style={{ flex: 1, minWidth: 0 }}
          >
            {mainSrc ? (
              <img
                src={mainSrc}
                alt={productName}
                className="product-gallery__main-img"
                style={{ width: '100%', maxHeight: 480, objectFit: 'contain' }}
              />
            ) : (
              <div className="product-gallery__main-placeholder">No Image</div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="product-gallery__main product-gallery__main--solo"
          style={{ maxWidth: 480 }}
        >
          <div
            className="product-gallery__main-placeholder"
            style={{
              aspectRatio: '1',
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No Image
          </div>
        </div>
      )}
    </div>
  );
}
