import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import ApiError from "./utils/ApIError.js";
import { sanitizeRequest } from "./middlewares/sanity.middleware.js";

const app = express();

const rateLimitHandler = (req, res, next) => {
  return next(new ApiError(429, "Too many requests, please try again later."));
};

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: rateLimitHandler,
});

app.use(limiter);
// custom middleware to sanitize request object
app.use(sanitizeRequest);
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

export default app;
