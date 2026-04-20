import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = Router();

const SALT_ROUNDS = 10;

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ sub: userId }, secret, { expiresIn });
}

function userPayload(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    nickname: user.nickname,
  };
}

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res
        .status(400)
        .json({ message: '이메일, 비밀번호, 닉네임을 모두 입력하세요.' });
    }

    const emailNorm = String(email).toLowerCase().trim();
    const nicknameNorm = String(nickname).trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return res.status(400).json({ message: '올바른 이메일 형식이 아닙니다.' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: '비밀번호는 6자 이상이어야 합니다.' });
    }

    if (nicknameNorm.length < 1) {
      return res.status(400).json({ message: '닉네임을 입력하세요.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      email: emailNorm,
      password: passwordHash,
      nickname: nicknameNorm,
    });

    const token = signToken(user._id.toString());
    return res.status(201).json({
      token,
      user: userPayload(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      const dupKey = err.keyValue
        ? Object.keys(err.keyValue)[0]
        : err.keyPattern
          ? Object.keys(err.keyPattern)[0]
          : null;
      if (dupKey === 'email') {
        return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
      }
      if (dupKey === 'nickname') {
        return res.status(409).json({ message: '이미 사용 중인 닉네임입니다.' });
      }
      return res.status(409).json({ message: '이미 가입된 정보입니다.' });
    }
    console.error(err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: '이메일과 비밀번호를 입력하세요.' });
    }

    const emailNorm = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: emailNorm }).select('+password');
    if (!user) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = signToken(user._id.toString());
    return res.json({
      token,
      user: userPayload(user),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
