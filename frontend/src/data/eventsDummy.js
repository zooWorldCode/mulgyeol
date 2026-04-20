/**
 * 이벤트 더미 데이터 — id / status 등만 수정해 사용
 * status: 'preview' | 'ongoing' | 'ended'
 */

export const DUMMY_EVENTS = [
  {
    id: 'evt-1',
    title: '봄맞이 도자기 할인',
    image: '/images/sample1.jpg',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    status: 'ongoing',
  },
  {
    id: 'evt-2',
    title: '신규 회원 웰컴 쿠폰',
    image: '/images/sample2.jpg',
    startDate: '2026-05-01',
    endDate: '2026-05-15',
    status: 'preview',
  },
  {
    id: 'evt-3',
    title: '여름 시즌 한정 세트',
    image: '',
    startDate: '2026-06-01',
    endDate: '2026-06-20',
    status: 'preview',
  },
  {
    id: 'evt-4',
    title: '베스트셀러 묶음 특가',
    image: '/images/sample3.jpg',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    status: 'ended',
  },
  {
    id: 'evt-5',
    title: '화병 컬렉션 출시 기념',
    image: '/images/sample1.jpg',
    startDate: '2026-04-10',
    endDate: '2026-04-25',
    status: 'ongoing',
  },
  {
    id: 'evt-6',
    title: '주말 플래시 세일',
    image: '/images/sample2.jpg',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    status: 'ended',
  },
  {
    id: 'evt-7',
    title: '컵/다기 라인 확장',
    image: '',
    startDate: '2026-04-20',
    endDate: '2026-05-10',
    status: 'ongoing',
  },
  {
    id: 'evt-8',
    title: '장식 오브제 사전 예약',
    image: '/images/sample3.jpg',
    startDate: '2026-05-20',
    endDate: '2026-06-05',
    status: 'preview',
  },
  {
    id: 'evt-9',
    title: '그릇 세트 무료 배송',
    image: '/images/sample1.jpg',
    startDate: '2026-01-10',
    endDate: '2026-01-31',
    status: 'ended',
  },
  {
    id: 'evt-10',
    title: '접시 1+1',
    image: '/images/sample2.jpg',
    startDate: '2026-04-15',
    endDate: '2026-04-22',
    status: 'ongoing',
  },
  {
    id: 'evt-11',
    title: 'MD 추천 기획전',
    image: '/images/sample3.jpg',
    startDate: '2026-05-05',
    endDate: '2026-05-30',
    status: 'preview',
  },
  {
    id: 'evt-12',
    title: '클리어런스 위크',
    image: '',
    startDate: '2025-12-01',
    endDate: '2025-12-24',
    status: 'ended',
  },
];

export function getEventById(id) {
  return DUMMY_EVENTS.find((e) => e.id === id) ?? null;
}
