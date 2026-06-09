import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const razorpayInstance = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const calculateOrder = async (items) => {
  let amount = 0;
  const productData = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product || !product.inStock) {
      throw new Error(`${product?.name || "Product"} is unavailable`);
    }

    const selectedOption = product.quantityOptions.find(
      (opt) =>
        Number(opt.value) === Number(item.option.value) &&
        String(opt.unit)  === String(item.option.unit)
    );

    if (!selectedOption) {
      throw new Error(`Invalid option selected for ${product.name}`);
    }

    const price = selectedOption.price;
    amount += price * item.quantity;

    productData.push({
      name:     product.name,
      price,
      quantity: item.quantity,
    });
  }
  amount += Math.floor(amount * 0.02);

  return { amount, productData };
};
const validateAddress = async (addressId, userId) => {
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) throw new Error("Invalid delivery address");
  return address;
};

export const palceOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid order data" });
    }

    await validateAddress(address, userId);

    const { amount } = await calculateOrder(items);

    await Order.create({
      userId,
      items: items.map((item) => ({
        product:  item.product,
        quantity: item.quantity,
        option: {
          value: item.option?.value,
          unit:  item.option?.unit,
          price: item.option?.price,
        },
      })),
      amount,
      address,          
      paymentType: "COD",
      status: "Order Confirmed",
      isPaid: false,
    });

    await User.findByIdAndUpdate(userId, { cartItems: [] });

    res.json({ success: true, message: "Order placed successfully!" });

  } catch (error) {
    console.error("COD Order Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const palceOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;
    const origin = req.headers.origin || "http://localhost:5173";

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid order data" });
    }

    await validateAddress(address, userId);

    const { amount, productData } = await calculateOrder(items);

    if (amount < 50) {
      return res.json({ success: false, message: "Minimum online order is ₹50" });
    }
    const order = await Order.create({
      userId,
      items: items.map((item) => ({
        product:  item.product,
        quantity: item.quantity,
        option: {
          value: item.option?.value,
          unit:  item.option?.unit,
          price: item.option?.price,
        },
      })),
      amount,
      address,              
      paymentType: "Stripe", 
      status: "Order Confirmed",
      isPaid: false,
    });

    const line_items = productData.map((item) => ({
      price_data: {
        currency:     "inr",
        product_data: { name: item.name },
        unit_amount:  Math.floor(item.price * 1.02 * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode:        "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url:  `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.json({ success: true, url: session.url });

  } catch (error) {
    console.error("Stripe Order Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid order data" });
    }

    await validateAddress(address, userId);

    const { amount } = await calculateOrder(items);

    const orderDB = await Order.create({
      userId,
      items: items.map((item) => ({
        product:  item.product,
        quantity: item.quantity,
        option: {
          value: item.option?.value,
          unit:  item.option?.unit,
          price: item.option?.price,
        },
      })),
      amount,
      address,              
      paymentType: "Razorpay", 
      status: "Order Confirmed",
      isPaid: false,
    });

    const razorpayOrder = await razorpayInstance.orders.create({
      amount:   amount * 100,
      currency: "INR",
      receipt:  orderDB._id.toString(),
    });

    res.json({
      success:   true,
      order:     razorpayOrder,
      key:       process.env.RAZORPAY_KEY_ID,
      dbOrderId: orderDB._id,
    });

  } catch (error) {
    console.error("Razorpay Order Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Order.findByIdAndUpdate(dbOrderId, { isPaid: true });
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.json({ success: false, message: "Payment verification failed" });
    }

  } catch (error) {
    console.error("Razorpay Verify Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const stripeWebhooks = async (request, response) => {
  const signature = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe Webhook Error:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { orderId, userId } = session.metadata;

    await Order.findByIdAndUpdate(orderId, { isPaid: true });
    await User.findByIdAndUpdate(userId, { cartItems: [] });
  }

  response.json({ received: true });
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("items.product")
      .populate("address")        
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    console.error("Get User Orders Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .populate("address")         
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    console.error("Get All Orders Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const allowedStatuses = [
      "Order Confirmed",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res.json({ success: false, message: "Order already delivered" });
    }

    if (order.status === "Cancelled") {
      return res.json({ success: false, message: "Order already cancelled" });
    }

    order.status = status;

    if (status === "Cancelled") {
      order.cancelReason = "Cancelled by seller";
      order.cancelledAt  = new Date();
    }

    await order.save();

    res.json({ success: true, message: "Order status updated" });

  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const cancelOrderByUser = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    const cancellableStatuses = ["Order Placed", "Order Confirmed"];
    if (!cancellableStatuses.includes(order.status)) {
      return res.json({
        success: false,
        message: `Cannot cancel an order that is ${order.status}`,
      });
    }

    order.status       = "Cancelled";
    order.cancelReason = "Cancelled by customer";
    order.cancelledAt  = new Date();

    await order.save();

    res.json({ success: true, message: "Order cancelled successfully" });

  } catch (error) {
    console.error("Cancel Order Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
