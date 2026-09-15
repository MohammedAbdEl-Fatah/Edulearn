import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/app.error";
import { MulterError } from "multer";


//in app.ts i call this error controller
export const globalErrorController = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.error("❌❌", err.message);
    if (err instanceof MulterError) {
        if (err.message.includes("File too large")) return res.status(400).json({ status: false, message: "File too large, It's must be less than 100MB" });
        if (err.message.includes("Unexpected field")) return res.status(400).json({ status: false, message: "Invalid file field" });
        if (err.message.includes("File too large")) return res.status(400).json({ status: false, message: "File too large, It's must be less than 100MB" });
        return res.status(400).json({ status: false, message: err.message });
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ status: false, message: err.message });
    }
    return res.status(500).json({ status: false, message: "Internal server error" });
}


