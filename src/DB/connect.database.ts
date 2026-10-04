import mongoose from "mongoose";
import { env } from "../config/env.local";


export const connectDatabase = async (): Promise<void> => {
    const uri = env.mongoUri || process.env.MONGO_URI || env.mongoUriLocal || process.env.MONGO_URI_LOCAL;
    if (!uri) {
        throw new Error("MONGO_URI environment variable is not defined.");
    }

    await mongoose.connect(uri).then(() => {
        console.log(`Connected to MongoDB ${uri}`);
    }).catch((error) => {
        console.error(`Failed to connect to MongoDB ${uri}`, error);
        throw error;
    });
};
