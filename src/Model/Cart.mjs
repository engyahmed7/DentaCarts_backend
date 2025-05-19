import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  price: Number,
  qty: Number,
  img: String,
  stock: Number,
});

const CartSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // user identifier
  items: [CartItemSchema],
});

export default mongoose.model("Cart", CartSchema);
