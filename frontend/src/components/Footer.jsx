import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="site-footer"
      style={{
        borderTop: '1px solid var(--shadow-bright)',
        marginTop: 'auto',
      }}
    >
      <div className="container" style={{ padding: '12px 16px' }}>
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </footer>
  );
}
