import { validateEnvVars } from "./util/validateEnvVars";
import dotenv from "dotenv";
dotenv.config();

const REQUIRED_ENV_VARS = ["OPENAI_API_KEY", "OPENAI_MODEL"];

validateEnvVars(REQUIRED_ENV_VARS);

export default {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  ALLOWED_PROD_ORIGINS_COMMA_SEP: process.env.ALLOWED_PROD_ORIGINS_COMMA_SEP,
};
