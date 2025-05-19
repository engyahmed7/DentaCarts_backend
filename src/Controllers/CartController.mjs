import { ExpressError } from "../utils/ExpressError.mjs";
import Product from "../Model/Product.mjs";
import Cart from "../Model/Cart.mjs"; // <-- import new model

export { add, get, update, destroy };

async function add(req, res) {
  const { email } = req.decodedUser;
  const { productId, qty: qtyRaw } = req.body;
  const qty = parseInt(qtyRaw);

  if (!productId || !qty) throw new ExpressError("Invalid request", 400);

  const product = await Product.findById(productId);
  if (!product) throw new ExpressError("Invalid Product ID", 404);
  if (product.stock < 1) throw new ExpressError("Out of stock", 400);

  if (qty > product.stock) throw new ExpressError("Not enough stock", 400);

  const productToCart = {
    productId: product._id,
    name: product.title,
    price: product.price,
    qty: qty,
    img: product.image[0],
    stock: product.stock,
  };

  let cart = await Cart.findOne({ email });

  if (!cart) {
    // Create new cart doc
    cart = new Cart({
      email,
      items: [productToCart],
    });
  } else {
    // Cart exists: check if product exists
    const itemIndex = cart.items.findIndex((el) =>
      el.productId.equals(productToCart.productId)
    );
    if (itemIndex > -1) {
      // Update qty and stock
      cart.items[itemIndex].qty += qty;
      cart.items[itemIndex].stock = product.stock;

      if (cart.items[itemIndex].qty > cart.items[itemIndex].stock)
        throw new ExpressError("Not enough stock", 400);
    } else {
      // Add new product item
      cart.items.push(productToCart);
    }
  }

  await cart.save();

  if (!req.body.reorder) {
    return res.send(cart.items);
  } else {
    return cart.items;
  }
}

async function get(req, res) {
  const { email } = req.decodedUser;

  let cart = await Cart.findOne({ email });
  if (!cart) cart = { items: [] };

  return res.send(cart.items);
}

async function update(req, res) {
  const { email } = req.decodedUser;
  const { productId, qty } = req.body;

  if (!productId || qty == null) throw new ExpressError("Invalid request", 400);

  let cart = await Cart.findOne({ email });
  if (!cart) throw new ExpressError("Cart not found", 404);

  const itemIndex = cart.items.findIndex((el) =>
    el.productId.equals(productId)
  );
  if (itemIndex === -1)
    throw new ExpressError("Product not found in cart", 404);

  if (qty > cart.items[itemIndex].stock)
    throw new ExpressError("Not enough stock", 400);

  if (qty <= 0) {
    cart.items.splice(itemIndex, 1); // remove item
  } else {
    cart.items[itemIndex].qty = qty; // update qty
  }

  await cart.save();
  return res.send(cart.items);
}

async function destroy(req, res) {
  const { email } = req.decodedUser;
  const { productId } = req.body;

  if (!productId) throw new ExpressError("Invalid request", 400);

  let cart = await Cart.findOne({ email });
  if (!cart) throw new ExpressError("Cart not found", 404);

  cart.items = cart.items.filter((item) => !item.productId.equals(productId));
  await cart.save();

  return res.send(cart.items);
}
