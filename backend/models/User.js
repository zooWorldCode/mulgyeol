import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    /** 소셜 계정 식별 (예: google:123) — 있으면 OAuth로 가입/연동된 사용자 */
    socialKey: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
