import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: "customer" | "admin";
  googleId?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
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
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    googleId: String,
    image: String,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
