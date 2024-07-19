import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, // n seconds window
  max: 8, // limit calls per IP per windowMs
  message: "Too many requests from this IP, please try again later.",
});
