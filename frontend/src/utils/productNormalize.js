/**
 * 카테고리 목록·상세 공통: `public/images/product_list/{folder}/{id}/…`
 * (Category.jsx ProductFrame과 동일 규칙)
 */
const LIST_THUMB_EXT = 'png';
const MAX_PRODUCT_LIST_GALLERY_IMAGES = 8;

/** @type {Record<string, string | undefined>} */
export const PRODUCT_LIST_FOLDER = {
  plate: 'plate',
  bowl: 'bowl',
  cup_teaware: 'cup',
  decor: 'deco',
  vase: 'vase',
};

function listFolderForRow(categoryParam, product) {
  if (categoryParam === 'all' && product?.category) {
    return PRODUCT_LIST_FOLDER[product.category] || null;
  }
  return PRODUCT_LIST_FOLDER[categoryParam] || null;
}

/** @returns {string | null} */
function listThumbIdFromName(nameRaw) {
  const name = String(nameRaw || '').trim();
  const sample = name.match(/(?:접시|그릇|컵)\s*샘플\s*(\d+)/);
  if (sample) return sample[1];
  if (name === '다기 세트') return '2';
  if (name === '장식 오브제') return '1';
  if (name === '장식 트레이') return '2';
  const vase = name.match(/화병\s*([AB])\s*$/i);
  if (vase) return vase[1].toUpperCase() === 'A' ? '1' : '2';
  return null;
}

function listThumbnailPair(folder, id) {
  if (!folder || !id) return null;
  const fileId = folder === 'deco' ? '1' : id;
  const primary = `/images/product_list/${folder}/${id}/${fileId}_1.${LIST_THUMB_EXT}`;
  const secondary = `/images/product_list/${folder}/${id}/${fileId}_2.${LIST_THUMB_EXT}`;
  const legacy = `/images/product_list/${folder}/${id}/${id} (1).${LIST_THUMB_EXT}`.replace(
    / /g,
    '%20'
  );
  return { primary, secondary, legacy };
}

function listGalleryImageCandidates(folder, id) {
  if (!folder || !id) return [];
  const fileId = folder === 'deco' ? '1' : id;
  return Array.from(
    { length: MAX_PRODUCT_LIST_GALLERY_IMAGES },
    (_, index) =>
      `/images/product_list/${folder}/${id}/${fileId}_${index + 1}.${LIST_THUMB_EXT}`
  );
}

/**
 * 카테고리 그리드용 단일 썸네일 URL (ProductFrame)
 * @param {string} categoryParam URL `category` 또는 `'all'`
 */
export function resolveCategoryListImages(categoryParam, p) {
  const folder = listFolderForRow(categoryParam, p);
  const id = listThumbIdFromName(p.name);
  const pair = folder && id ? listThumbnailPair(folder, id) : null;
  if (!pair) {
    const fallback =
      p.image || (Array.isArray(p.images) && p.images.find(Boolean)) || null;
    return { imageSrc: fallback, imageSrcFallback: undefined };
  }
  return { imageSrc: pair.primary, imageSrcFallback: pair.legacy };
}

/**
 * 상세 갤러리: `product_list` 규칙으로 나온 URL을 **먼저** 넣고, API `images`·`image`는 그 뒤에 합칩니다.
 * 목록 썸네일과 같은 상품이면 동일한 대표 이미지가 보입니다.
 * @param {object} product
 * @returns {string[]}
 */
export function getGalleryImages(product) {
  if (!product) return [];

  const urls = [];
  const folder = PRODUCT_LIST_FOLDER[product.category];
  const id = listThumbIdFromName(product.name);
  if (folder && id) {
    return listGalleryImageCandidates(folder, id);
  }

  const arr = Array.isArray(product.images)
    ? product.images.filter((x) => typeof x === 'string' && x.trim())
    : [];
  for (const u of arr) {
    const t = String(u).trim();
    if (t && !urls.includes(t)) urls.push(t);
  }
  if (product.image && String(product.image).trim()) {
    const t = String(product.image).trim();
    if (!urls.includes(t)) urls.push(t);
  }

  return urls;
}

/**
 * 카테고리 ProductFrame·상세 ProductInfo 공통 가격 표시.
 * 정가: DB값이 판매가보다 크면 사용, 아니면 `Math.round(sale / 0.8)` (역산 정가).
 * 할인율: 위에서 확정한 정가·판매가로만 계산(DB `discountRate`와 불일치할 수 있어 표시는 통일).
 * @returns {{ sale: number; original: number | null; discountRate: number }}
 */
export function getPricing(product) {
  const sale = Number(product.price) || 0;
  let original =
    product.originalPrice != null && product.originalPrice !== ''
      ? Number(product.originalPrice)
      : null;
  if (
    original == null ||
    !Number.isFinite(original) ||
    original <= sale
  ) {
    original = sale > 0 ? Math.round(sale / 0.8) : null;
  }

  const discountRate =
    original != null && original > sale
      ? Math.round(((original - sale) / original) * 100)
      : 0;

  return { sale, original, discountRate };
}

/** @param {object} product */
export function getDefaultOptions(product) {
  if (Array.isArray(product.options) && product.options.length)
    return product.options.map(String);
  return ['기본'];
}

const FALLBACK_SPECS = [
  { label: '재질', value: '상세 페이지에서 확인' },
  { label: '크기', value: '상세 페이지에서 확인' },
  { label: '색상', value: '상세 페이지에서 확인' },
  { label: '제작 방식', value: '상세 페이지에서 확인' },
  { label: '주의사항', value: '파손에 주의해 주세요' },
];

/** @param {object} product */
export function getDetailSpecs(product) {
  if (Array.isArray(product.detailSpecs) && product.detailSpecs.length)
    return product.detailSpecs;
  return FALLBACK_SPECS;
}
