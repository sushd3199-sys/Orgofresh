import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';
import contactRouter from "./routes/contactRoute.js";
import subscribeRouter from "./routes/subscribeRoute.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,       
].filter(Boolean);

console.log("Allowed Origins:", allowedOrigins);

app.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
}));
app.get('/', (req, res) => res.send('Orgofresh API is running'));
app.use('/api/user',      userRouter);
app.use('/api/seller',    sellerRouter);
app.use('/api/product',   productRouter);
app.use('/api/cart',      cartRouter);
app.use('/api/address',   addressRouter);
app.use('/api/order',     orderRouter);
app.use('/api/contact',   contactRouter);
app.use('/api/subscribe', subscribeRouter);
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
