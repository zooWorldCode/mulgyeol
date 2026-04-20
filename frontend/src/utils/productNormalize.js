/** @param {object} product */
export function getGalleryImages(product) {
  const arr = Array.isArray(product.images)
    ? product.images.filter((x) => typeof x === 'string' && x.trim())
    : [];
  if (arr.length) return arr;
  if (product.image && String(product.image).trim()) return [product.image];
  return [];
}

/** @param {object} product */
export function getPricing(product) {
  const sale = Number(product.price) || 0;
  const orig =
    product.originalPrice != null && Number(product.originalPrice) > sale
      ? Number(product.originalPrice)
      : sale > 0
        ? Math.ceil(sale * 1.2)
        : 1000;
  const rate =
    product.discountRate != null && Number(product.discountRate) >= 0
      ? Number(product.discountRate)
      : orig > sale
        ? Math.round(((orig - sale) / orig) * 100)
        : 0;
  return { sale, original: orig, discountRate: rate };
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
