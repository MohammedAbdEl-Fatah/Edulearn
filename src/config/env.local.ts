import { config } from "dotenv";
config();

export const env = {
    mongoUri: process.env.MONGO_URI,
    SALT_ROUND: process.env.SALT_ROUND,
};
