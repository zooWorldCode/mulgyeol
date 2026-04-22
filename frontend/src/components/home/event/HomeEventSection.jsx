import { Link } from 'react-router-dom';
import './HomeEventSection.css';

export default function HomeEventSection() {
  return (
    <section className="home-event-section" aria-label="이벤트">
      <div className="home-event-section__banner">
        <div className="home-event-section__inner">
          <span className="home-event-section__top">
            <span className="home-event-section__copy">
              <p>INSPIRED BY NATURE</p>
              <p>봄 기획전</p>
              <p>04.10 - 05.31</p>
            </span>
            <span className="home-event-section__copy home-event-section__copy--right">
              <p>LIMITED RELEASE</p>
              <p>물결 × 오은희 작가</p>
              <p>한정 컬렉션</p>
            </span>
          </span>
          <img
            className="home-event-section__name"
            src="/images/main/event/name.svg"
            alt=""
            aria-hidden="true"
          />
          <p className="home-event-section__tagline">
            {'{ 본연을 잃지 않은 아름다움 }'}
          </p>
          <Link to="/event" className="home-event-section__button">
            <span className="home-event-section__button-text">
              이벤트 보러가기
            </span>
            <img src="/images/main/event/eventBt.png" alt="이벤트 페이지로 이동" />
          </Link>
        </div>
      </div>
    </section>
  );
}
