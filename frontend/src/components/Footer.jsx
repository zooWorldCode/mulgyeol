import { Link } from 'react-router-dom';
import './Footer.css';

function PlaceholderLink({ children, href = '#' }) {
  return (
    <a
      href={href}
      className="site-footer__link"
      onClick={(e) => {
        if (href === '#') e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__main">
          <div className="site-footer__left">
            <Link to="/" className="site-footer__logo">
              <img
                className="site-footer__logo-mark"
                src="/images/logo/CI_logo.svg"
                alt=""
                width={56}
                height={36}
              />
              <span className="site-footer__logo-word">MUL-GYEOL</span>
            </Link>
            <p className="site-footer__copyright">© 2026 MULGYEOL. ALL RIGHTS RESERVED.</p>
            <div className="site-footer__sns-rule" aria-hidden="true" />
            <div className="site-footer__sns">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <img src="/images/sns/T.svg" alt="" width={25} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <img src="/images/sns/F.svg" alt="" width={25} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src="/images/sns/I.svg" alt="" width={25} />
              </a>
            </div>
          </div>

          <div className="site-footer__columns">
            <nav className="site-footer__col" aria-label="고객지원">
              <h2 className="site-footer__col-title">고객지원</h2>
              <ul className="site-footer__list">
                <li>
                  <PlaceholderLink>고객센터</PlaceholderLink>
                </li>
                <li>
                  <PlaceholderLink>FAQ</PlaceholderLink>
                </li>
                <li>
                  <PlaceholderLink>배송 안내</PlaceholderLink>
                </li>
                <li>
                  <PlaceholderLink>교환·환불 정책</PlaceholderLink>
                </li>
                <li>
                  <PlaceholderLink>공지사항</PlaceholderLink>
                </li>
                <li>
                  <PlaceholderLink>1:1 문의</PlaceholderLink>
                </li>
              </ul>
            </nav>

            <div className="site-footer__col">
              <h2 className="site-footer__col-title">회사소개</h2>
              <ul className="site-footer__text-block">
                <li>상호명: 물결</li>
                <li>대표: 홍길동</li>
                <li>사업자등록번호: 123-45-67890</li>
                <li>통신판매업신고: 2026-서울강남-0000</li>
                <li>주소: 서울특별시 강남구 테헤란로 123</li>
                <li>고객센터: 02-1234-5678</li>
              </ul>
            </div>

            <nav className="site-footer__col" aria-label="정책">
              <h2 className="site-footer__col-title">정책</h2>
              <ul className="site-footer__list">
                <li>
                  <PlaceholderLink>이용약관</PlaceholderLink>
                </li>
                <li>
                  <PlaceholderLink>개인정보처리방침</PlaceholderLink>
                </li>
                <li>
                  <PlaceholderLink>사업자정보확인</PlaceholderLink>
                </li>
                <li>
                  <PlaceholderLink>이메일 무단수집 거부</PlaceholderLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
