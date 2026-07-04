import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject } from "zod";

export const isValidationBody =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {

            console.log("Middleware start");
            console.log("Middleware req:", req.body);
            try {
                schema.parse(req.body);

                console.log("Validation passed");


                console.log("Calling next");
                return next();
            } catch (error) {
                console.log("Validation failed", error);
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        message: "Validation failed",
                        errors: {
                            message: error.issues.map((issue) => issue.message),
                            path: error.issues.map((issue) => issue.path.at(0)),
                        },
                    });
                }

                return next(error);
            }
        };
        
export const isValidationParams =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {

            console.log("Middleware start");
            try {
                schema.parse({
                    params: req.params,
                });

                console.log("Validation passed");


                console.log("Calling next");
                return next();
            } catch (error) {
                console.log("Validation failed", error);
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        message: "Validation failed",
                        errors: error.issues,
                    });
                }

                return next(error);
            }
        };

        
export const isValidationQuery =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {

            console.log("Middleware start");
            try {
                schema.parse({
                    query: req.query,
                });

                console.log("Validation passed");


                console.log("Calling next");
                return next();
            } catch (error) {
                console.log("Validation failed", error);
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        message: "Validation failed",
                        errors: error.issues,
                    });
                }

                return next(error);
            }
        };