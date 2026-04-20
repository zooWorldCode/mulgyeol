import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { persistAuthToken } from '../auth/session.js';

const row = { marginBottom: 12 };

const TERMS_META = [
  { key: 'service', required: true, label: '[필수] 이용약관 동의' },
  { key: 'privacy', required: true, label: '[필수] 개인정보 처리방침 동의' },
  { key: 'age', required: true, label: '[필수] 만 14세 이상입니다' },
  { key: 'marketing', required: false, label: '[선택] 마케팅 정보 수신 동의' },
];

const initialTerms = () =>
  TERMS_META.reduce((acc, { key }) => {
    acc[key] = false;
    return acc;
  }, {});

export default function Signup() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [terms, setTerms] = useState(() => initialTerms());
  const [nicknameDup, setNicknameDup] = useState({
    status: 'idle',
    checkedAs: null,
    message: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const allTermsChecked = useMemo(
    () => TERMS_META.every(({ key }) => terms[key]),
    [terms]
  );

  function onNicknameChange(e) {
    setNickname(e.target.value);
    setNicknameDup({ status: 'idle', checkedAs: null, message: '' });
  }

  function setAllTerms(checked) {
    setTerms(
      TERMS_META.reduce((acc, { key }) => {
        acc[key] = checked;
        return acc;
      }, {})
    );
  }

  function toggleTerm(key, checked) {
    setTerms((prev) => ({ ...prev, [key]: checked }));
  }

  async function handleCheckNickname() {
    const n = nickname.trim();
    setSubmitError('');
    if (!n) {
      setNicknameDup({
        status: 'error',
        checkedAs: null,
        message: '닉네임을 입력한 뒤 중복확인을 해 주세요.',
      });
      return;
    }
    setNicknameDup({ status: 'checking', checkedAs: null, message: '' });
    try {
      const { data } = await api.get('/api/auth/check-nickname', {
        params: { nickname: n },
      });
      const msg =
        typeof data?.message === 'string'
          ? data.message
          : data?.available
            ? '사용 가능한 닉네임입니다.'
            : '이미 사용 중인 닉네임입니다.';
      if (data.available) {
        setNicknameDup({
          status: 'ok',
          checkedAs: n,
          message: msg,
        });
      } else {
        setNicknameDup({
          status: 'taken',
          checkedAs: null,
          message: msg,
        });
      }
    } catch (err) {
      setNicknameDup({
        status: 'error',
        checkedAs: null,
        message:
          err.response?.data?.message ||
          err.message ||
          '중복 확인에 실패했습니다.',
      });
    }
  }

  function validateClient() {
    const errors = [];
    const nick = nickname.trim();
    const emailNorm = email.trim();
    const pwd = password;
    const pwd2 = passwordConfirm;

    if (!nick) errors.push('닉네임을 입력하세요.');
    if (nicknameDup.status !== 'ok' || nick !== nicknameDup.checkedAs) {
      errors.push('닉네임 중복확인을 완료해 주세요.');
    }

    if (!emailNorm) errors.push('이메일을 입력하세요.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      errors.push('올바른 이메일 형식이 아닙니다.');
    }

    if (pwd.length < 6) errors.push('비밀번호는 6자 이상이어야 합니다.');
    if (pwd !== pwd2) errors.push('비밀번호와 비밀번호 확인이 일치하지 않습니다.');

    const requiredOk = TERMS_META.filter((t) => t.required).every((t) => terms[t.key]);
    if (!requiredOk) {
      errors.push('필수 약관에 모두 동의해 주세요.');
    }

    return { errors, nick, emailNorm, pwd };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    const { errors, nick, emailNorm, pwd } = validateClient();
    if (errors.length) {
      setSubmitError(errors.join(' '));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/signup', {
        email: emailNorm,
        password: pwd,
        nickname: nick,
      });
      persistAuthToken(data.token, true, data.user ?? null);
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        '회원가입에 실패했습니다.';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h1 style={{ marginTop: 0 }}>회원가입</h1>

      <form onSubmit={handleSubmit}>
        <div style={row}>
          <label htmlFor="signup-nickname">닉네임</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
            <input
              id="signup-nickname"
              type="text"
              value={nickname}
              onChange={onNicknameChange}
              autoComplete="nickname"
              style={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}
            />
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={nicknameDup.status === 'checking'}
            >
              {nicknameDup.status === 'checking' ? '확인 중…' : '중복확인'}
            </button>
          </div>
          {nicknameDup.message ? (
            <p
              role="status"
              style={{
                margin: '6px 0 0',
                fontSize: 13,
                color:
                  nicknameDup.status === 'ok' ? 'green' : 'crimson',
              }}
            >
              {nicknameDup.message}
            </p>
          ) : null}
        </div>

        <div style={row}>
          <label htmlFor="signup-email">이메일</label>
          <br />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={row}>
          <label htmlFor="signup-password">비밀번호 (6자 이상)</label>
          <br />
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={row}>
          <label htmlFor="signup-password2">비밀번호 확인</label>
          <br />
          <input
            id="signup-password2"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          {passwordConfirm.length > 0 && password !== passwordConfirm ? (
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'crimson' }}>
              비밀번호가 일치하지 않습니다.
            </p>
          ) : null}
        </div>

        <fieldset style={{ margin: '20px 0', border: '1px solid #ccc', padding: 12 }}>
          <legend style={{ fontSize: 14 }}>약관 동의</legend>

          <div style={{ marginBottom: 10 }}>
            <label>
              <input
                type="checkbox"
                checked={allTermsChecked}
                onChange={(e) => setAllTerms(e.target.checked)}
              />{' '}
              모두 확인하였으며 동의합니다
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TERMS_META.map(({ key, label }) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={terms[key]}
                  onChange={(e) => toggleTerm(key, e.target.checked)}
                />{' '}
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? '처리 중…' : '회원가입'}
        </button>
      </form>

      {submitError ? (
        <p role="alert" style={{ color: 'crimson', marginTop: 12 }}>
          {submitError}
        </p>
      ) : null}
    </div>
  );
}
