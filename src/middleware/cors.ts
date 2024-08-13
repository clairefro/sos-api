import { Request, Response, NextFunction } from "express";
import config from "../config";

const allowedOrigins = config.ALLOWED_PROD_ORIGINS_COMMA_SEP?.split(",") || [];

const CORS_ERR_MSG = "Not allowed by CORS";

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    if (process.env.NODE_ENV === "development") {
      // Allow all origins in development
      callback(null, true);
    } else if (origin && allowedOrigins.includes(origin)) {
      // enforce strict CORS in production
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
    res.status(403).json({ error: CORS_ERR_MSG });
  } else {
    next(err);
  }
};
