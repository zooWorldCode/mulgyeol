import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization') || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      nickname: user.nickname,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
}
