import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import {
  getAllOrders,
  getUserOrders,
  palceOrderCOD,
  palceOrderStripe,
  placeOrderRazorpay,
  verifyRazorpayPayment,
  updateOrderStatus,
  cancelOrderByUser,  
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// User routes
orderRouter.post('/cod',              authUser,   palceOrderCOD);
orderRouter.post('/stripe',           authUser,   palceOrderStripe);
orderRouter.post('/razorpay',         authUser,   placeOrderRazorpay);
orderRouter.post('/razorpay/verify',  authUser,   verifyRazorpayPayment);
orderRouter.get('/user',              authUser,   getUserOrders);
orderRouter.post('/cancel',           authUser,   cancelOrderByUser);  

// Seller / Admin routes
orderRouter.get('/seller',            authSeller, getAllOrders);
orderRouter.post('/update-status',    authSeller, updateOrderStatus);

export default orderRouter;
