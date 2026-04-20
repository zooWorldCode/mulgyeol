import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { persistAuthToken } from '../auth/session.js';
import {
  SOCIAL_PROVIDER_IDS,
  SOCIAL_PROVIDER_LABELS,
  socialLoginHandlers,
} from '../auth/socialAuth.js';

const linkStyle = {
  color: '#06c',
  textDecoration: 'underline',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  font: 'inherit',
};

const rowGap = { marginBottom: 10 };

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      persistAuthToken(data.token, remember, data.user ?? null);
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        '로그인에 실패했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <h1 style={{ marginTop: 0 }}>로그인</h1>

      <form onSubmit={handleLogin}>
        <div style={rowGap}>
          <label htmlFor="login-email">이메일</label>
          <br />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={rowGap}>
          <label htmlFor="login-password">비밀번호</label>
          <br />
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ ...rowGap, marginTop: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />{' '}
            로그인 저장
          </label>
          <div
            style={{
              fontSize: 12,
              color: '#555',
              marginTop: 4,
            }}
          >
            체크 시 브라우저에 토큰을 저장하며, 약 30일간 유지됩니다. 미체크 시
            탭을 닫으면 로그인이 해제됩니다.
          </div>
        </div>

        <div
          style={{
            ...rowGap,
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <a
            href="#"
            style={linkStyle}
            onClick={(e) => e.preventDefault()}
          >
            이메일 찾기
          </a>
          <span aria-hidden="true">|</span>
          <a
            href="#"
            style={linkStyle}
            onClick={(e) => e.preventDefault()}
          >
            비밀번호 찾기
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginTop: 16,
          }}
        >
          <button type="submit" disabled={loading}>
            {loading ? '처리 중…' : '로그인'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            disabled={loading}
          >
            회원가입
          </button>
        </div>
      </form>

      {error ? (
        <p role="alert" style={{ color: 'crimson', marginTop: 12 }}>
          {error}
        </p>
      ) : null}

      <section style={{ marginTop: 28, borderTop: '1px solid #ddd', paddingTop: 16 }}>
        <p style={{ margin: '0 0 12px', fontSize: 14 }}>소셜 로그인으로 가입하기</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SOCIAL_PROVIDER_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => socialLoginHandlers[id]?.()}
              style={{
                padding: '8px 12px',
                textAlign: 'left',
                border: '1px solid #ccc',
                background: '#fafafa',
                cursor: 'pointer',
              }}
            >
              {SOCIAL_PROVIDER_LABELS[id]} 로그인
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
