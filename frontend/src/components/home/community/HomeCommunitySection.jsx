import { Link } from 'react-router-dom';
import './HomeCommunitySection.css';

const notices = [
  { title: '택배사 파업으로 인한 배송 지연 안내', date: '2026.04.10' },
  { title: '일부 제품 가격 조정 안내', date: '2026.04.02' },
  { title: '봄 시즌 신제품 출시 안내', date: '2026.03.30' },
];

const faqItems = ['주문 & 배송', '교환 & 환불', '제품 관련', '회원 & 결제'];

const featureCards = [
  {
    to: '/community',
    label: '국내 최대 규모 도자 전시회, 올해는 무엇이 달라졌나?',
    large: true,
  },
  {
    to: '/blog',
    label: '도자기를 오래 쓰는 가장 쉬운 관리법',
  },
  {
    to: '/event',
    label: '새 시즌 클래스와 전시 소식을 만나보세요',
  },
];

export default function HomeCommunitySection() {
  return (
    <section className="home-community" aria-labelledby="home-community-title">
      <Link to="/community" className="home-community__heading">
        <h2 id="home-community-title">커뮤니티</h2>
        <span className="home-community__heading-arrow" aria-hidden="true">-&gt;</span>
      </Link>

      <div className="home-community__feature-grid">
        {featureCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={
              'home-community__feature-card' +
              (card.large ? ' home-community__feature-card--large' : '')
            }
          >
            <span className="home-community__feature-caption">{card.label}</span>
            <span className="home-community__feature-arrow" aria-hidden="true">
              &gt;
            </span>
          </Link>
        ))}
      </div>

      <div className="home-community__info-grid">
        <section className="home-community__notice" aria-labelledby="home-notice-title">
          <div className="home-community__notice-head">
            <h3 id="home-notice-title">공지사항</h3>
            <Link to="/community" className="home-community__notice-more">
              전체보기
            </Link>
          </div>
          <ul className="home-community__notice-list">
            {notices.map((notice) => (
              <li key={notice.title} className="home-community__notice-item">
                <Link to="/community">
                  <span>{notice.title}</span>
                  <time dateTime={notice.date.replaceAll('.', '-')}>{notice.date}</time>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-community__faq" aria-labelledby="home-faq-title">
          <div className="home-community__faq-title">
            <span>FAQ</span>
            <h3 id="home-faq-title">자주 묻는 질문</h3>
          </div>
          <div className="home-community__faq-list">
            {faqItems.map((item) => (
              <Link key={item} to="/community" className="home-community__faq-link">
                {item}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
