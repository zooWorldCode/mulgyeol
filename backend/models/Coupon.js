import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      default: null,
    },
    guestId: {
      type: String,
      trim: true,
      default: null,
    },
    type: {
      type: String,
      enum: ['5%', '10%', 'freeShipping'],
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    issuedDate: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

couponSchema.index({ userId: 1, issuedDate: 1 });
couponSchema.index({ guestId: 1, issuedDate: 1 });

export default mongoose.model('Coupon', couponSchema);
