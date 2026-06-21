import mongoose from "mongoose";
import { env } from "../config/env.local";
const uri = env.mongoUri;

export const connectDatabase = async (): Promise<void> => {
    if (!uri) {
        throw new Error("MONGO_URI environment variable is not defined.");
    }

    if (mongoose.connection.readyState === 1) {
        console.log("Database already connected.");
        return;
    }

    try {
        await mongoose.connect(uri);

        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};