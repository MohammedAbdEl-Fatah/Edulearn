import { config } from "dotenv";
config();

export const env = {
        mongoUri: process.env.MONGO_URI,
        SALT_ROUND: process.env.SALT_ROUND,
        USER_EMAIL: process.env.USER_EMAIL,
        USER_PASSWORD: process.env.USER_PASSWORD,
};
