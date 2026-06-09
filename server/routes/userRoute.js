
import express from "express";
import authUser from "../middlewares/authUser.js";
import { login, register, isAuth, logout, verifyOtp, forgotPassword, resetPassword, googleLogin } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", logout);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/google-login", googleLogin);
export default userRouter ;


userRouter.post("/register", register);