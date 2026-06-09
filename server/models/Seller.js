import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  role: { type: String, default: "seller" }, 
  otp: String,
  otpExpire: Number,
  resetToken: String,
  resetTokenExpiry: Date,
});

export default mongoose.model("Seller", sellerSchema);