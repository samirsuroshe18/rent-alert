import mongoose, { Schema } from "mongoose";

const CheckoutSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  pin: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 0,
  },

  mobile: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
}, { timestamps: true });

export const Checkout = mongoose.model("Checkout", CheckoutSchema);
