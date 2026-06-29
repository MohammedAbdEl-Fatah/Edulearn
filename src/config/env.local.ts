import { config } from "dotenv";
config();

export const env = {
        mongoUri: process.env.MONGO_URI,
        SALT_ROUND: process.env.SALT_ROUND,
        USER_EMAIL: process.env.USER_EMAIL,
        USER_PASSWORD: process.env.USER_PASSWORD,
        ENCRYPT_KEY: process.env.ENCRYPT_KEY,
        SECRET_TOKEN_ACCESS_STUDENT: process.env.SECRET_TOKEN_ACCESS_STUDENT,
        SECRET_TOKEN_ACCESS_TEACHER: process.env.SECRET_TOKEN_ACCESS_TEACHER,
        SECRET_TOKEN_REFRESH_STUDENT: process.env.SECRET_TOKEN_REFRESH_STUDENT,
        SECRET_TOKEN_REFRESH_TEACHER: process.env.SECRET_TOKEN_REFRESH_TEACHER
};
