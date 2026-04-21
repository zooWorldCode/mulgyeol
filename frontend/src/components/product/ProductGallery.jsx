import { useEffect, useMemo, useState } from 'react';
import './ProductGallery.css';

const THUMB_VISIBLE = 5;

/**
 * @param {{
 *   images: string[];
 *   productName: string;
 *   listImagePrimary?: string | null;
 *   listImageFallback?: string | null;
 * }} props
 * listImage*: 카테고리 목록과 동일한 product_list URL — 대표 이미지 404 시 fallback으로 교체
 */
export default function ProductGallery({
  images,
  productName,
  listImagePrimary = null,
  listImageFallback = null,
}) {
  const [mainIndex, setMainIndex] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const [mainSrcOverride, setMainSrcOverride] = useState(null);

  const candidates = useMemo(
    () =>
      Array.from(
        new Set(
          images.filter((src) => typeof src === 'string' && src.trim())
        )
      ),
    [images]
  );
  const [loadedImages, setLoadedImages] = useState([]);
  const list = loadedImages;
  const hasImages = list.length > 0;

  useEffect(() => {
    setMainIndex(0);
    setThumbOffset(0);
    setMainSrcOverride(null);
    setLoadedImages([]);

    if (!candidates.length || typeof Image === 'undefined') return undefined;

    let cancelled = false;
    const loadedByIndex = Array(candidates.length).fill(null);

    candidates.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        loadedByIndex[index] = src;
        setLoadedImages(loadedByIndex.filter(Boolean));
      };
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [candidates.join('|')]);

  useEffect(() => {
    setMainSrcOverride(null);
  }, [mainIndex]);

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

  const baseMainSrc = hasImages ? list[mainIndex] : null;
  const mainSrc = mainSrcOverride ?? baseMainSrc;

  function removeBrokenImage(src) {
    if (!src) return;
    setLoadedImages((current) => current.filter((item) => item !== src));
    setMainIndex(0);
  }

  function handleMainImgError() {
    if (
      listImageFallback &&
      listImagePrimary &&
      !mainSrcOverride &&
      baseMainSrc === listImagePrimary
    ) {
      setMainSrcOverride(listImageFallback);
      return;
    }
    removeBrokenImage(baseMainSrc);
  }

  return (
    <div className="product-gallery">
      {hasImages ? (
        <div className="product-gallery__layout">
          <div className="product-gallery__thumbs-col">
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
                    >
                      <img
                        src={src}
                        alt=""
                        className="product-gallery__thumb-img"
                        onError={() => removeBrokenImage(src)}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="product-gallery__scroll-btn product-gallery__scroll-btn--down"
              onClick={() => setThumbOffset((o) => Math.min(maxThumbOffset, o + 1))}
              disabled={!canDown}
              aria-label="썸네일 아래로"
            >
              ↓
            </button>
          </div>
          <div className="product-gallery__main">
            {mainSrc ? (
              <img
                src={mainSrc}
                alt={productName}
                className="product-gallery__main-img"
                onError={handleMainImgError}
              />
            ) : (
              <div className="product-gallery__main-placeholder">No Image</div>
            )}
          </div>
        </div>
      ) : (
        <div className="product-gallery__main product-gallery__main--solo">
          <div className="product-gallery__main-placeholder">No Image</div>
        </div>
      )}
    </div>
  );
}
