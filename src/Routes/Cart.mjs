import express from "express";
import { catchAsync } from "../utils/catchAsync.mjs";
import * as cart from "../Controllers/CartController.mjs";

export { router };
const router = express.Router();


router
  .route("/")
  .post(catchAsync(cart.add))
  .get(catchAsync(cart.get))
  .put(catchAsync(cart.update))
  .delete(catchAsync(cart.destroy));



