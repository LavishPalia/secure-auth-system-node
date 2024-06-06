import ApiError from "../utils/ApIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  // extract token from cookies
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return next(new ApiError(401, "No token, Unauthorized denied"));
  }

  try {
    // decode user detials from token
    const decodedUser = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // set a new user property on request object
    req.user = decodedUser;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid Token, Unauthorized denied"));
  }
});
