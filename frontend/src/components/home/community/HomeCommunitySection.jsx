import { Link } from 'react-router-dom';
import { DUMMY_POSTS } from '../../../data/postsDummy.js';
import './HomeCommunitySection.css';

const notices = [
  { title: '배송 지연 안내', date: '2026.04.10' },
  { title: '일부 상품 가격 조정 안내', date: '2026.04.02' },
  { title: '봄 시즌 신제품 출시 안내', date: '2026.03.30' },
];

const faqItems = ['주문 & 배송', '교환 & 환불', '상품 문의', '회원 & 결제'];

export default function HomeCommunitySection() {
  const featureCards = DUMMY_POSTS.slice(0, 3).map((post, index) => ({
    id: post.id,
    to: `/blog/${post.id}`,
    label: post.title,
    image: post.image,
    large: index === 0,
  }));

  return (
    <section className="home-community" aria-labelledby="home-community-title">
      <Link to="/community" className="home-community__heading">
        <h2 id="home-community-title">커뮤니티</h2>
        <span className="home-community__heading-arrow" aria-hidden="true">-&gt;</span>
      </Link>

      <div className="home-community__feature-grid">
        {featureCards.map((card) => (
          <Link
            key={card.id}
            to={card.to}
            className={
              'home-community__feature-card' +
              (card.large ? ' home-community__feature-card--large' : '')
            }
          >
            {card.image ? (
              <img
                className="home-community__feature-image"
                src={card.image}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <span className="home-community__feature-overlay" aria-hidden="true" />
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
