import mongoose from "mongoose";
import { env } from "../config/env.local";

const uri = env.mongoUri;

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache:
        | {
              conn: typeof mongoose | null;
              promise: Promise<typeof mongoose> | null;
          }
        | undefined;
}

const getCache = () => {
    if (!global.mongooseCache) {
        global.mongooseCache = { conn: null, promise: null };
    }
    return global.mongooseCache;
};

export const connectDatabase = async (): Promise<void> => {
    if (!uri) {
        throw new Error("MONGO_URI environment variable is not defined.");
    }

    const cached = getCache();

    if (cached.conn) {
        return;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri);
    }

    try {
        cached.conn = await cached.promise;
        console.log("Connected to MongoDB");
    } catch (error) {
        cached.promise = null;
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
};
