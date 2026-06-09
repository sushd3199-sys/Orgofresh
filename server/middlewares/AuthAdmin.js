import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

const authAdmin = async (req, res, next) => {
  try {
    const { adminToken} = req.cookies;
    console.log("COOKIES:", req.cookies);

    if (!adminToken) {
      // return res.json({ success: false, message: "Not authorized" });
      return res.json({ success: false, message: "No admin token" });
    }

    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

    const admin= await Seller.findById(decoded.id);

    if (!admin|| admin.role !== "admin") {
      return res.json({ success: false, message: "Admin only" });
    }

    req.adminId = admin._id;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default authAdmin;