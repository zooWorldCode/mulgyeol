import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';

dotenv.config();

/**
 * 상품 더미 데이터 — 이 배열만 고친 뒤 `yarn seed` (또는 `npm run seed`) 실행
 *
 * category: 'plate' | 'bowl' | 'cup_teaware' | 'vase' | 'decor'
 * image / images: 문자열 경로
 */
const PRODUCTS = [
  {
    name: '접시 샘플 1',
    subtitle: '매트 무광 도자기 접시',
    price: 12000,
    originalPrice: 18000,
    discountRate: 33,
    image: '/images/sample1.jpg',
    images: ['/images/sample1.jpg', '/images/sample2.jpg', '/images/sample3.jpg'],
    category: 'plate',
    description: '데일리 식탁에 어울리는 접시입니다.',
    detailSpecs: [
      { label: '재질', value: '도자기' },
      { label: '크기', value: '직경 25cm' },
      { label: '색상', value: '화이트' },
      { label: '제작 방식', value: '1230℃ 고화 도자기' },
      { label: '주의사항', value: '직화·오븐 사용 금지' },
    ],
    popularity: 120,
    rating: 4.5,
    reviewCount: 32,
    options: ['화이트', '그레이', '베이지'],
    shippingNote: '택배 배송 · 3만원 이상 무료배송',
  },
  {
    name: '접시 샘플 2',
    subtitle: '미니 플레이트',
    price: 15000,
    originalPrice: 19000,
    discountRate: 21,
    image: '',
    images: [],
    category: 'plate',
    description: '이미지 없음 예시 상품입니다.',
    detailSpecs: [
      { label: '재질', value: '도자기' },
      { label: '크기', value: '직경 12cm' },
      { label: '색상', value: '내추럴' },
      { label: '제작 방식', value: '핸드메이드' },
      { label: '주의사항', value: '충격에 약할 수 있음' },
    ],
    popularity: 95,
    rating: 4.2,
    reviewCount: 11,
    options: ['기본'],
    shippingNote: '택배 배송',
  },
  {
    name: '그릇 샘플 1',
    subtitle: '라면용 대접',
    price: 18000,
    originalPrice: 22000,
    discountRate: 18,
    image: '/images/sample2.jpg',
    images: ['/images/sample2.jpg', '/images/sample1.jpg'],
    category: 'bowl',
    description: '깊은 볼 타입 그릇입니다.',
    detailSpecs: [
      { label: '재질', value: '도자기' },
      { label: '크기', value: '직경 16cm · 높이 8cm' },
      { label: '색상', value: '크림' },
      { label: '제작 방식', value: '기계 성형' },
      { label: '주의사항', value: '전자레인지 사용 가능' },
    ],
    popularity: 110,
    rating: 4.8,
    reviewCount: 56,
    options: ['크림', '차콜'],
    shippingNote: '택배 배송 · 제주/도서 추가 운임',
  },
  {
    name: '그릇 샘플 2',
    subtitle: '공기 세트',
    price: 22000,
    originalPrice: 26000,
    discountRate: 15,
    image: '/images/sample1.jpg',
    images: ['/images/sample1.jpg'],
    category: 'bowl',
    description: '공기 2P 세트',
    detailSpecs: [
      { label: '재질', value: '도자기' },
      { label: '크기', value: '직경 11cm' },
      { label: '색상', value: '화이트' },
      { label: '제작 방식', value: '도장' },
      { label: '주의사항', value: '식기세척기 사용 가능' },
    ],
    popularity: 88,
    rating: 4.0,
    reviewCount: 8,
    options: ['2P 세트'],
    shippingNote: '택배 배송',
  },
  {
    name: '컵 샘플 1',
    subtitle: '핸들 머그',
    price: 9000,
    originalPrice: 12000,
    discountRate: 25,
    image: '/images/sample3.jpg',
    images: ['/images/sample3.jpg', '/images/sample2.jpg', '/images/sample1.jpg'],
    category: 'cup_teaware',
    description: '350ml 머그컵',
    detailSpecs: [
      { label: '재질', value: '도자기' },
      { label: '크기', value: '350ml' },
      { label: '색상', value: '세이지' },
      { label: '제작 방식', value: '유약 도포' },
      { label: '주의사항', value: '뜨거운 음료 시 뚜껑 주의' },
    ],
    popularity: 200,
    rating: 4.9,
    reviewCount: 120,
    options: ['세이지', '코랄'],
    shippingNote: '택배 배송',
  },
  {
    name: '다기 세트',
    subtitle: '다기 + 받침',
    price: 45000,
    originalPrice: 52000,
    discountRate: 13,
    image: '/images/sample1.jpg',
    images: ['/images/sample1.jpg', '/images/sample3.jpg'],
    category: 'cup_teaware',
    description: '다도용 다기 세트',
    detailSpecs: [
      { label: '재질', value: '백자' },
      { label: '크기', value: '다기 높이 9cm' },
      { label: '색상', value: '백색' },
      { label: '제작 방식', value: '전통 이차 소성' },
      { label: '주의사항', value: '파손 주의 · 단독 포장' },
    ],
    popularity: 60,
    rating: 4.6,
    reviewCount: 19,
    options: ['기본 구성'],
    shippingNote: '택배 배송 · 안전 포장',
  },
  {
    name: '화병 A',
    subtitle: '슬림 롱 베이스',
    price: 28000,
    originalPrice: 35000,
    discountRate: 20,
    image: '',
    images: [],
    category: 'vase',
    description: '슬림형 화병',
    detailSpecs: [
      { label: '재질', value: '유리 + 도자 받침' },
      { label: '크기', value: '높이 28cm' },
      { label: '색상', value: '클리어' },
      { label: '제작 방식', value: '블로운 글래스' },
      { label: '주의사항', value: '날카로운 모서리 주의' },
    ],
    popularity: 75,
    rating: 4.3,
    reviewCount: 14,
    options: ['S', 'M'],
    shippingNote: '택배 배송',
  },
  {
    name: '화병 B',
    subtitle: '와이드 볼',
    price: 35000,
    originalPrice: 40000,
    discountRate: 12,
    image: '/images/sample2.jpg',
    images: ['/images/sample2.jpg'],
    category: 'vase',
    description: '꽃꽂이용 와이드 화병',
    detailSpecs: [
      { label: '재질', value: '도자기' },
      { label: '크기', value: '직경 18cm' },
      { label: '색상', value: '모카' },
      { label: '제작 방식', value: '핸드 페인팅' },
      { label: '주의사항', value: '얼음 사용 금지' },
    ],
    popularity: 70,
    rating: 4.1,
    reviewCount: 6,
    options: ['모카', '샌드'],
    shippingNote: '택배 배송',
  },
  {
    name: '장식 오브제',
    subtitle: '미니 조각',
    price: 16000,
    originalPrice: 20000,
    discountRate: 20,
    image: '/images/sample3.jpg',
    images: ['/images/sample3.jpg', '/images/sample2.jpg'],
    category: 'decor',
    description: '선반 장식용 오브제',
    detailSpecs: [
      { label: '재질', value: '레진 + 도료' },
      { label: '크기', value: '가로 8cm' },
      { label: '색상', value: '골드 포인트' },
      { label: '제작 방식', value: '캐스팅' },
      { label: '주의사항', value: '직사광선 장시간 노출 시 변색 가능' },
    ],
    popularity: 55,
    rating: 3.9,
    reviewCount: 4,
    options: ['A타입', 'B타입'],
    shippingNote: '택배 배송',
  },
  {
    name: '장식 트레이',
    subtitle: '우드 핸들 트레이',
    price: 24000,
    originalPrice: 28000,
    discountRate: 14,
    image: '/images/sample1.jpg',
    images: ['/images/sample1.jpg', '/images/sample2.jpg'],
    category: 'decor',
    description: '티타임 트레이',
    detailSpecs: [
      { label: '재질', value: '원목 + 스테인' },
      { label: '크기', value: '40x25cm' },
      { label: '색상', value: '월넛' },
      { label: '제작 방식', value: 'CNC 가공' },
      { label: '주의사항', value: '물에 장시간 담그지 마세요' },
    ],
    popularity: 62,
    rating: 4.4,
    reviewCount: 22,
    options: ['월넛', '오크'],
    shippingNote: '택배 배송',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  await Product.deleteMany({});

  if (!PRODUCTS.length) {
    console.log('PRODUCTS 배열이 비어 있어 삽입하지 않았습니다.');
  } else {
    await Product.insertMany(PRODUCTS);
    console.log(`삭제 후 ${PRODUCTS.length}개 상품을 삽입했습니다.`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
