import mongoose from "mongoose";

const { Schema, model } = mongoose;

const wishlistItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: [{ type: String }],
  stock: { type: Number, required: true },
});

const wishlistSchema = new Schema({
  email: { type: String, required: true, unique: true },
  items: [wishlistItemSchema],
});

const Wishlist = model("Wishlist", wishlistSchema);

export default Wishlist;
