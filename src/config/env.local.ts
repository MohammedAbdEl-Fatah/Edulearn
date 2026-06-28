import { config } from "dotenv";
config();

export const env = {
        mongoUri: process.env.MONGO_URI,
        SALT_ROUND: process.env.SALT_ROUND,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
