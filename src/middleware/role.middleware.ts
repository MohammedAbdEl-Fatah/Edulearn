import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/app.error";
import { RoleUSER } from "../utils/enum";

export const allowRoles = (...roles: RoleUSER[]) => {
      return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                  return next(new AppError("Unauthorized", 401));
            }
            if (!roles.includes(req.user.role as RoleUSER)) {
                  return next(new AppError("Forbidden", 403));
            }
            next();
      }

}