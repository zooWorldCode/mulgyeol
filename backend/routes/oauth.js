import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signAccessToken } from '../lib/accessToken.js';

const router = Router();

const SALT_ROUNDS = 10;

function frontendBase() {
  return (process.env.FRONTEND_PUBLIC_URL || 'http://localhost:5173').replace(/\/$/, '');
}

function oauthRedirectBase() {
  return (
    process.env.OAUTH_REDIRECT_BASE_URL ||
    process.env.BACKEND_PUBLIC_URL ||
    process.env.FRONTEND_PUBLIC_URL ||
    'http://localhost:5173'
  ).replace(/\/$/, '');
}

function callbackUrl(provider) {
  const base = oauthRedirectBase();
  return `${base}/api/auth/oauth/${provider}/callback`;
}

function oauthStateToken(provider) {
  return jwt.sign({ oauth: 1, provider }, process.env.JWT_SECRET, {
    expiresIn: '10m',
  });
}

function verifyOAuthState(state) {
  const payload = jwt.verify(state, process.env.JWT_SECRET);
  if (!payload.oauth || !payload.provider) {
    throw new Error('invalid_state');
  }
  return payload.provider;
}

function redirectLoginError(res, message) {
  const fe = frontendBase();
  res.redirect(
    302,
    `${fe}/login?oauth_error=${encodeURIComponent(message)}`
  );
}

async function postForm(url, bodyObj) {
  const body = new URLSearchParams(bodyObj);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: body.toString(),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg = json.error_description || json.error || json.message || text || res.statusText;
    throw new Error(String(msg).slice(0, 200));
  }
  if (json && json.error) {
    throw new Error(
      String(json.error_description || json.error || 'token_error').slice(0, 200)
    );
  }
  return json;
}

async function uniqueNickname(base) {
  const raw = (base || 'user').toString().trim().slice(0, 20).replace(/\s+/g, '_') || 'user';
  let candidate = raw;
  let i = 0;
  while (await User.findOne({ nickname: candidate })) {
    i += 1;
    candidate = `${raw.slice(0, 14)}_${i}`;
  }
  return candidate;
}

async function findOrCreateOAuthUser({ provider, providerUserId, email, nickname }) {
  const socialKey = `${provider}:${providerUserId}`;

  let user = await User.findOne({ socialKey });
  if (user) return user;

  let emailNorm = email ? String(email).toLowerCase().trim() : '';
  if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    emailNorm = `${provider}_${providerUserId}@oauth.local`;
  }

  let existing = await User.findOne({ email: emailNorm });
  if (existing) {
    if (existing.socialKey && existing.socialKey !== socialKey) {
      throw new Error('이 이메일은 이미 다른 소셜·로그인 방식으로 가입되어 있습니다.');
    }
    if (!existing.socialKey) {
      existing.socialKey = socialKey;
      await existing.save();
    }
    return existing;
  }

  let suffix = 0;
  let tryEmail = emailNorm;
  while (await User.findOne({ email: tryEmail })) {
    suffix += 1;
    tryEmail = `${provider}_${providerUserId}_${suffix}@oauth.local`;
  }
  emailNorm = tryEmail;

  const nick = await uniqueNickname(nickname || emailNorm.split('@')[0]);
  const randomPwd = crypto.randomBytes(32).toString('hex');
  const passwordHash = await bcrypt.hash(randomPwd, SALT_ROUNDS);

  user = await User.create({
    email: emailNorm,
    password: passwordHash,
    nickname: nick,
    socialKey,
  });
  return user;
}

/** GET /oauth/:provider/start */
router.get('/oauth/:provider/start', (req, res) => {
  const provider = req.params.provider;
  if (!['naver', 'kakao', 'google'].includes(provider)) {
    return res.status(404).send('Unknown provider');
  }

  const state = oauthStateToken(provider);
  const cb = callbackUrl(provider);

  try {
    if (provider === 'google') {
      const id = process.env.GOOGLE_CLIENT_ID;
      const secret = process.env.GOOGLE_CLIENT_SECRET;
      if (!id || !secret) {
        return res.status(503).send('Google OAuth: .env에 GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET 을 설정하세요.');
      }
      const q = new URLSearchParams({
        client_id: id,
        redirect_uri: cb,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        access_type: 'online',
        include_granted_scopes: 'true',
      });
      return res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${q}`);
    }

    if (provider === 'kakao') {
      const id = process.env.KAKAO_REST_API_KEY;
      if (!id) {
        return res.status(503).send('Kakao OAuth: .env에 KAKAO_REST_API_KEY 를 설정하세요.');
      }
      const q = new URLSearchParams({
        client_id: id,
        redirect_uri: cb,
        response_type: 'code',
        state,
        scope: 'profile_nickname,account_email',
      });
      return res.redirect(302, `https://kauth.kakao.com/oauth/authorize?${q}`);
    }

    if (provider === 'naver') {
      const id = process.env.NAVER_CLIENT_ID;
      const secret = process.env.NAVER_CLIENT_SECRET;
      if (!id || !secret) {
        return res.status(503).send('Naver OAuth: .env에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 을 설정하세요.');
      }
      const q = new URLSearchParams({
        response_type: 'code',
        client_id: id,
        redirect_uri: cb,
        state,
      });
      return res.redirect(302, `https://nid.naver.com/oauth2.0/authorize?${q}`);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send('OAuth start error');
  }
  return res.status(500).send('OAuth start error');
});

/** GET /oauth/:provider/callback */
router.get('/oauth/:provider/callback', async (req, res) => {
  const provider = req.params.provider;
  const { code, state, error, error_description } = req.query;

  if (error) {
    return redirectLoginError(
      res,
      error_description || error || '소셜 로그인이 취소되었습니다.'
    );
  }

  if (!code || !state) {
    return redirectLoginError(res, '인증 코드가 없습니다.');
  }

  let stateProvider;
  try {
    stateProvider = verifyOAuthState(String(state));
  } catch {
    return redirectLoginError(res, '잘못된 요청(state)입니다.');
  }

  if (stateProvider !== provider) {
    return redirectLoginError(res, '공급자 정보가 일치하지 않습니다.');
  }

  const cb = callbackUrl(provider);

  try {
    let profile;

    if (provider === 'google') {
      const json = await postForm('https://oauth2.googleapis.com/token', {
        code: String(code),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: cb,
        grant_type: 'authorization_code',
      });
      const accessToken = json.access_token;
      const me = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const u = await me.json();
      if (!me.ok) throw new Error(u.error?.message || 'Google profile');
      profile = {
        id: String(u.id),
        email: u.email || '',
        nickname: u.name || (u.email ? u.email.split('@')[0] : ''),
      };
    } else if (provider === 'kakao') {
      const body = {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: cb,
        code: String(code),
      };
      if (process.env.KAKAO_CLIENT_SECRET) {
        body.client_secret = process.env.KAKAO_CLIENT_SECRET;
      }
      const json = await postForm('https://kauth.kakao.com/oauth/token', body);
      const accessToken = json.access_token;
      const me = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const u = await me.json();
      if (!me.ok) throw new Error(u.msg || 'Kakao profile');
      const acc = u.kakao_account || {};
      const prof = acc.profile || {};
      profile = {
        id: String(u.id),
        email: acc.email || '',
        nickname: prof.nickname || `kakao${u.id}`,
      };
    } else if (provider === 'naver') {
      const json = await postForm('https://nid.naver.com/oauth2.0/token', {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code: String(code),
        state: String(state),
      });
      const accessToken = json.access_token;
      const me = await fetch('https://openapi.naver.com/v1/nid/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await me.json();
      if (!me.ok || data.resultcode !== '00') {
        throw new Error(data.message || 'Naver profile');
      }
      const u = data.response || {};
      profile = {
        id: String(u.id),
        email: u.email || '',
        nickname: u.nickname || (u.email ? u.email.split('@')[0] : ''),
      };
    } else {
      return redirectLoginError(res, '지원하지 않는 공급자입니다.');
    }

    const user = await findOrCreateOAuthUser({
      provider,
      providerUserId: profile.id,
      email: profile.email,
      nickname: profile.nickname,
    });

    const token = signAccessToken(user);
    const fe = frontendBase();
    return res.redirect(302, `${fe}/login?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error('OAuth callback:', err);
    return redirectLoginError(
      res,
      err.message || '소셜 로그인 처리 중 오류가 발생했습니다.'
    );
  }
});

export default router;
