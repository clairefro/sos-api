import { Request, Response, NextFunction } from "express";
import config from "../config";

const devOrigin = "http://localhost:5173";
const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? [devOrigin]
    : config.ALLOWED_PROD_ORIGINS_COMMA_SEP?.split(",") || [];

const CORS_ERR_MSG = "Not allowed by CORS";

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(CORS_ERR_MSG));
    }
  },
};

export const handleCorsError = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.message === CORS_ERR_MSG) {
    res.status(403).json({ error: "Not allowed by CORS" });
  } else {
    next(err);
  }
};
