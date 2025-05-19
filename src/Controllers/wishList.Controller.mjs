import { ExpressError } from "../utils/ExpressError.mjs";
import Product from "../Model/Product.mjs";
import Wishlist from "../Model/Wishlist.mjs";

export { add, get, update, destroy, toggleFavorite };

async function toggleFavorite(req, res) {
  const { email } = req.decodedUser;
  const { productId } = req.body;
  if (!productId) throw new ExpressError("Invalid request", 400);

  const product = await Product.findById(productId);
  if (!product) throw new ExpressError("Invalid Product ID", 404);

  let wishlist = await Wishlist.findOne({ email });

  const productToWishList = {
    productId: product._id,
    name: product.title,
    price: product.price,
    img: product.image,
    stock: product.stock,
  };

  if (!wishlist) {
    wishlist = new Wishlist({
      email,
      items: [productToWishList],
    });
    await wishlist.save();
    return res
      .status(200)
      .json({ message: "Added to favorites", wishList: wishlist.items });
  }

  const existingIndex = wishlist.items.findIndex((item) =>
    item.productId.equals(product._id)
  );

  if (existingIndex === -1) {
    wishlist.items.push(productToWishList);
    await wishlist.save();
    return res
      .status(200)
      .json({ message: "Added to favorites", wishList: wishlist.items });
  } else {
    wishlist.items.splice(existingIndex, 1);
    await wishlist.save();
    return res
      .status(200)
      .json({ message: "Removed from favorites", wishList: wishlist.items });
  }
}

async function add(req, res) {
  const { email } = req.decodedUser;
  const { productId } = req.body;
  if (!productId) throw new ExpressError("Invalid request", 400);

  const product = await Product.findById(productId);
  if (!product) throw new ExpressError("Invalid Product ID", 404);

  let wishlist = await Wishlist.findOne({ email });

  const productToWishList = {
    productId: product._id,
    name: product.title,
    price: product.price,
    img: product.image,
    stock: product.stock,
  };

  if (!wishlist) {
    wishlist = new Wishlist({
      email,
      items: [productToWishList],
    });
  } else {
    const exists = wishlist.items.some((item) =>
      item.productId.equals(product._id)
    );
    if (!exists) {
      wishlist.items.push(productToWishList);
    }
  }

  await wishlist.save();

  if (!req.body.reorder) {
    return res.json(wishlist.items);
  }
}

async function get(req, res) {
  const { email } = req.decodedUser;
  const wishlist = await Wishlist.findOne({ email });
  return res.json(wishlist ? wishlist.items : []);
}

async function update(req, res) {
  const { email } = req.decodedUser;
  const items = req.body;

  if (!items) throw new ExpressError("Unauthorized", 401);

  let wishlist = await Wishlist.findOne({ email });
  if (!wishlist) {
    wishlist = new Wishlist({ email, items });
  } else {
    wishlist.items = items;
  }

  await wishlist.save();
  return res.json(wishlist.items);
}

async function destroy(req, res) {
  const { email } = req.decodedUser;
  try {
    await Wishlist.findOneAndDelete({ email });
    return res.json("WishList deleted successfully");
  } catch (error) {
    throw new ExpressError("Wishlist deletion error", 500);
  }
}
