import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/app.error";


//in app.ts i call this error controller
export const globalErrorController = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ status: false, message: err.message });
    }
    return res.status(500).json({ status: false, message: "Internal server error" });
}


