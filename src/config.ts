import { validateEnvVars } from "./util/validateEnvVars";
import dotenv from "dotenv";
dotenv.config();

/** LIST ALL REQUIRED ENV VARS HERE */
const REQUIRED_ENV_VARS = ["OPENAI_API_KEY"];

/** Ensure required env vars are present */
validateEnvVars(REQUIRED_ENV_VARS);

export default {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: "gpt-4o",
};
