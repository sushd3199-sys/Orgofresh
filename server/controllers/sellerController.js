import jwt from 'jsonwebtoken';
import Seller from "../models/Seller.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import transporter from "../configs/mailer.js";

// ADMIN LOGIN 
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password required" });
    }

    const admin = await Seller.findOne({ email, role: "admin" });
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path:     "/",
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      admin: {
        _id:   admin._id,
        name:  admin.name,
        email: admin.email,
        role:  admin.role,
      },
    });

  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
// ADMIN LOGOUT
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path:     "/",
    });
    return res.json({ success: true, message: "Admin logged out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// SELLER LOGIN
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password required" });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.json({ success: false, message: "Seller not found" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path:     "/",
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      seller: {
        _id:   seller._id,
        name:  seller.name,
        email: seller.email,
        role:  seller.role,
      },
    });

  } catch (error) {
    console.error("Seller Login Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// IS ADMIN AUTH
export const isAdminAuth = async (req, res) => {
  try {
    const { adminToken } = req.cookies;
    if (!adminToken) return res.json({ success: false });

    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    const admin   = await Seller.findById(decoded.id).select("-password");

    if (!admin || admin.role !== "admin") return res.json({ success: false });

    res.json({ success: true, admin });

  } catch {
    res.json({ success: false });
  }
};

// IS SELLER AUTH
export const isSellerAuth = async (req, res) => {
  try {
    const { sellerToken } = req.cookies;
    if (!sellerToken) return res.json({ success: false });

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    const seller  = await Seller.findById(decoded.id).select("-password");

    return res.json({ success: true, seller });

  } catch (error) {
    return res.json({ success: false });
  }
};

// CREATE ADMIN 
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Seller.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await Seller.create({ name, email, password: hashed, role: "admin" });

    res.json({ success: true, message: "Admin created" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN CREATE SELLER
export const adminCreateSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Seller.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await Seller.create({ name, email, password: hashed, role: "seller" });

    res.json({ success: true, message: "Seller created" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN DELETE SELLER
export const adminDeleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) return res.json({ success: false, message: "sellerId missing" });

    const seller = await Seller.findById(sellerId);
    if (!seller) return res.json({ success: false, message: "Seller not found" });
    if (seller.role === "admin") return res.json({ success: false, message: "Cannot delete admin" });

    await Seller.findByIdAndDelete(sellerId);
    res.json({ success: true, message: "Seller deleted" });

  } catch (error) {
    console.error("Delete Seller Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// GET ALL SELLERS
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({ role: "seller" }).select("-password");
    res.json({ success: true, sellers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// SELLER FORGOT PASSWORD
export const sellerForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.json({ success: false, message: "Seller not found" });

    const token = crypto.randomBytes(32).toString("hex");
    seller.resetToken       = token;
    seller.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await seller.save();

    const baseUrl    = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink  = `${baseUrl}/seller/reset-password/${token}`;

    await transporter.sendMail({
      from:    `"Orgofresh" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: "Reset Your Seller Password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#16A34A">Password Reset</h2>
          <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#16A34A;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
            Reset Password
          </a>
          <p style="color:#94A3B8;font-size:12px">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "Reset link sent to email" });

  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// SELLER RESET PASSWORD
export const sellerResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const seller = await Seller.findOne({
      resetToken:       token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!seller) {
      return res.json({ success: false, message: "Invalid or expired token" });
    }

    seller.password         = await bcrypt.hash(password, 10);
    seller.resetToken       = undefined;
    seller.resetTokenExpiry = undefined;
    await seller.save();

    res.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// SELLER CHANGE PASSWORD
export const sellerChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const seller = await Seller.findById(req.sellerId);

    const isMatch = await bcrypt.compare(oldPassword, seller.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong current password" });
    }

    seller.password = await bcrypt.hash(newPassword, 10);
    await seller.save();

    res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// SELLER LOGOUT
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path:     "/",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
