import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  saleOff?: number;
  categoryId: mongoose.Types.ObjectId;
  gender: string;
  isFeatured: boolean;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    saleOff: {
      type: Number,
      min: 0,
      max: 100,
    },
    images: {
      type: [String],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
