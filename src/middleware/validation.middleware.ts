import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

export const isValidation = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            })

            return next()
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map(e => ({
                    message: e.message,
                    path: e.path.join(".")
                }))
                return res.status(400).json({ message: "Validation failed", errors })
            }

        }
    }

};