/**
 * Event dummy data.
 * status: 'preview' | 'ongoing' | 'ended'
 */

export const DUMMY_EVENTS = [
  {
    id: '1',
    title: '도자기 식기세트 기획전',
    image: '/images/event/1.png',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    status: 'preview',
    statusLabel: '예정',
  },
  {
    id: '2',
    title: '회원가입 즉시 적립 이벤트',
    image: '/images/event/2.png',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    status: 'preview',
    statusLabel: '예정',
  },
  {
    id: '3',
    title: '내 식탁 자랑 포토 리뷰 이벤트',
    image: '/images/event/3.png',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    status: 'ongoing',
    statusLabel: '진행중',
  },
  {
    id: '4',
    title: '첫 구매 고객님을 위한 특별 선물',
    image: '/images/event/4.png',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    status: 'ongoing',
    statusLabel: '진행중',
  },
  {
    id: '5',
    title: '이달의 도자기 도자기 전시회 할인',
    image: '/images/event/5.png',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    status: 'ended',
    statusLabel: '종료',
  },
  {
    id: '6',
    title: '전통 그대로! 새로운 도자기 세트 판매',
    image: '/images/event/6.png',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    status: 'ended',
    statusLabel: '종료',
  },
];

export function getEventById(id) {
  return DUMMY_EVENTS.find((event) => event.id === id) ?? null;
}
