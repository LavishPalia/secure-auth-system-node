import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

export default app;
