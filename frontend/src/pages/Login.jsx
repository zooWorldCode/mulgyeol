import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { parseUserFromAccessToken, persistAuthToken } from '../auth/session.js';
import { SOCIAL_PROVIDER_IDS, socialLoginHandlers } from '../auth/socialAuth.js';
import Button from '../components/common/Button.jsx';
import './Login.css';

const SOCIAL_IMAGE_NAME = {
  google: 'G',
  kakao: 'K',
  naver: 'N',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthErr = params.get('oauth_error');
    const token = params.get('token');
    if (!oauthErr && !token) return;

    if (oauthErr) {
      setError(decodeURIComponent(oauthErr));
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      const user = parseUserFromAccessToken(token);
      persistAuthToken(token, true, user);
      navigate('/', { replace: true });
    }
  }, [navigate]);

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
    <div className="login-page">
      <img src="/images/social_log/logo_log.png" alt="로그인 로고" width={200} />
      <form className="login-page__form" onSubmit={handleLogin}>
        <div className="login-page__field">
          <label className="login-page__label" htmlFor="login-email">
            이메일
          </label>
          <input
            id="login-email"
            className="login-page__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            required
          />
        </div>

        <div className="login-page__field">
          <label className="login-page__label" htmlFor="login-password">
            비밀번호
          </label>
          <input
            id="login-password"
            className="login-page__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="login-page__field login-page__field--remember">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />{' '}
            로그인 저장
          </label>
        </div>

        <div className="login-page__links">
          <a
            href="#"
            className="login-page__link"
            onClick={(e) => e.preventDefault()}
          >
            이메일 찾기
          </a>
          <a
            href="#"
            className="login-page__link"
            onClick={(e) => e.preventDefault()}
          >
            비밀번호 찾기
          </a>
        </div>

        <div className="login-page__actions">
          <Button type="submit" disabled={loading}>
            {loading ? '처리 중…' : '로그인'}
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={() => navigate('/signup')}
          >
            회원가입
          </Button>
        </div>
      </form>

      {error ? (
        <p className="login-page__error" role="alert">
          {error}
        </p>
      ) : null}

      <section className="login-page__social" aria-label="소셜 로그인">
        <p className="login-page__social-title">소셜 로그인으로 가입하기</p>
        <div className="login-page__social-list">
          {SOCIAL_PROVIDER_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className="login-page__social-image-btn"
              onClick={() => socialLoginHandlers[id]?.()}
              aria-label={`${id} 로그인`}
            >
              <img
                src={`/images/social_log/${SOCIAL_IMAGE_NAME[id]}.png`}
                alt={`${id} 로그인`}
                className="login-page__social-image"
              />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
