import { ExpressError } from "../utils/ExpressError.mjs";

export { isAdmin };

async function isAdmin(req, res, next) {
  try {
    console.log(req.decodedUser.role);
    // if (req.decodedUser.role !== "admin" || req.decodedUser.role !== "user") {
    //   throw new ExpressError("Unauthorized", 401);
    // }
    next();
  } catch (error) {
    next(error);
  }
}
