import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: Number,
      option: {
        value:  Number,
        unit:   String,
        price:  Number,
      },
    },
  ],

  amount: Number,
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
  },

  status: {
    type: String,
    default: "Order Placed",
  },

  paymentType: {
    type: String,
    default: "COD",
  },

  isPaid: {
    type: Boolean,
    default: false,
  },

  cancelReason: {
    type: String,
    default: "",
  },

  cancelledAt: Date,

}, { timestamps: true });

export default mongoose.model("order", orderSchema);
