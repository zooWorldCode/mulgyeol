import User from '../models/User.js';

/**
 * GET /api/auth/check-nickname?nickname=
 */
export async function checkNickname(req, res) {
  try {
    const raw = req.query.nickname;
    const nicknameNorm = raw != null ? String(raw).trim() : '';

    if (!nicknameNorm) {
      return res.status(400).json({
        available: false,
        message: '닉네임을 입력하세요.',
      });
    }

    const exists = await User.exists({ nickname: nicknameNorm });

    if (exists) {
      return res.json({
        available: false,
        message: '이미 사용 중인 닉네임입니다.',
      });
    }

    return res.json({
      available: true,
      message: '사용 가능한 닉네임입니다.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
