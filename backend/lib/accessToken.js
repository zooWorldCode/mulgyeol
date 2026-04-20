import jwt from 'jsonwebtoken';

export function signAccessToken(user) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      nickname: user.nickname,
    },
    secret,
    { expiresIn }
  );
}
