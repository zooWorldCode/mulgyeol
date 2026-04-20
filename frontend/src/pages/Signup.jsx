import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { persistAuthToken } from '../auth/session.js';
import Button from '../components/common/Button.jsx';
import './Signup.css';

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
    <div className="signup-page">
      <form className="signup-page__form" onSubmit={handleSubmit}>
        <div className="signup-page__field">
          <label className="signup-page__label" htmlFor="signup-nickname">
            닉네임
          </label>
          <div className="signup-page__nickname-row">
            <input
              id="signup-nickname"
              className="signup-page__input signup-page__input--grow"
              type="text"
              value={nickname}
              onChange={onNicknameChange}
              placeholder="닉네임을 입력하세요"
              required
              autoComplete="nickname"
            />
            <Button
              type="button"
              className="common-btn--inline"
              onClick={handleCheckNickname}
              disabled={nicknameDup.status === 'checking'}
            >
              {nicknameDup.status === 'checking' ? '확인 중…' : '중복확인'}
            </Button>
          </div>
          {nicknameDup.message ? (
            <p
              role="status"
              className={
                'signup-page__message' +
                (nicknameDup.status === 'ok'
                  ? ' signup-page__message--ok'
                  : ' signup-page__message--error')
              }
            >
              {nicknameDup.message}
            </p>
          ) : null}
        </div>

        <div className="signup-page__field">
          <label className="signup-page__label" htmlFor="signup-email">
            이메일
          </label>
          <input
            id="signup-email"
            className="signup-page__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
            autoComplete="email"
          />
        </div>

        <div className="signup-page__field">
          <label className="signup-page__label" htmlFor="signup-password">
            비밀번호 (6자 이상)
          </label>
          <input
            id="signup-password"
            className="signup-page__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
            autoComplete="new-password"
          />
        </div>

        <div className="signup-page__field">
          <label className="signup-page__label" htmlFor="signup-password2">
            비밀번호 확인
          </label>
          <input
            id="signup-password2"
            className="signup-page__input"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 확인하세요"
            required
            autoComplete="new-password"
          />
          {passwordConfirm.length > 0 && password !== passwordConfirm ? (
            <p className="signup-page__message signup-page__message--error">
              비밀번호가 일치하지 않습니다.
            </p>
          ) : null}
        </div>

        <fieldset className="signup-page__terms">
          <legend>약관 동의</legend>

          <div className="signup-page__terms-all">
            <label>
              <input
                type="checkbox"
                checked={allTermsChecked}
                onChange={(e) => setAllTerms(e.target.checked)}
              />{' '}
              모두 확인하였으며 동의합니다
            </label>
          </div>

          <div className="signup-page__terms-list">
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

        <Button type="submit" disabled={loading}>
          {loading ? '처리 중…' : '회원가입'}
        </Button>
      </form>

      {submitError ? (
        <p role="alert" className="signup-page__error">
          {submitError}
        </p>
      ) : null}
    </div>
  );
}
