import mongoose from 'mongoose';

const detailSpecSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discountRate: { type: Number, min: 0, max: 100 },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: ['plate', 'bowl', 'cup_teaware', 'vase', 'decor'],
    },
    description: { type: String, default: '' },
    detailSpecs: { type: [detailSpecSchema], default: [] },
    popularity: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    options: { type: [String], default: [] },
    shippingNote: { type: String, default: '택배 배송 · 주문 후 2~3일 이내 출고(영업일 기준)' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
