import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import './OrderCompletePage.css';

export default function OrderCompletePage() {
  const navigate = useNavigate();

  return (
    <main className="order-complete-page">
      <section className="order-complete-page__content" aria-labelledby="order-complete-title">
        <img
          className="order-complete-page__icon"
          src="/images/icon/check.png"
          alt="주문 완료 체크 아이콘"
        />

        <h1 id="order-complete-title" className="order-complete-page__title">
          주문이 완료되었습니다!
        </h1>

        <div className="order-complete-page__description">
          <p>주문해주셔서 감사합니다.</p>
          <p>고객님께 소중한 상품을 빠르게 배송해드리겠습니다.</p>
        </div>

        <div className="order-complete-page__divider" aria-hidden="true" />

        <div className="order-complete-page__actions">
          <Button
            type="button"
            className="order-complete-page__button"
            onClick={() => navigate('/mypage/orders')}
          >
            배송조회 보러가기
          </Button>
          <Button
            type="button"
            className="order-complete-page__button order-complete-page__button--home"
            onClick={() => navigate('/')}
          >
            홈으로 가기
          </Button>
        </div>
      </section>
    </main>
  );
}
