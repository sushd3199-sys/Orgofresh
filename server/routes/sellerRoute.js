import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout, sellerForgotPassword, sellerResetPassword, sellerChangePassword, createAdmin,  getAllSellers, adminDeleteSeller, adminCreateSeller, adminLogin, adminLogout, isAdminAuth } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';
import authAdmin from "../middlewares/AuthAdmin.js";


const sellerRouter = express.Router();
sellerRouter.post("/create-admin", createAdmin);
sellerRouter.post("/admin/login", adminLogin);
sellerRouter.get("/admin/logout", adminLogout);
sellerRouter.get("/admin/is-auth", isAdminAuth);
sellerRouter.get("/admin/all-sellers", authAdmin , getAllSellers);
sellerRouter.post("/admin/create-seller", authAdmin, adminCreateSeller);
sellerRouter.post("/admin/delete-seller", authAdmin , adminDeleteSeller);
sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', isSellerAuth);
sellerRouter.get('/logout', authSeller, sellerLogout);
sellerRouter.post("/forgot-password", sellerForgotPassword);
sellerRouter.post("/reset-password", sellerResetPassword);
sellerRouter.post("/change-password", authSeller, sellerChangePassword);
export default sellerRouter;


