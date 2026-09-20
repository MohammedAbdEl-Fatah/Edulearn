import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import userService from "./user.service";
export const userController = Router();
userController.get("/profile",
    authMiddleware,
    userService.getInformationUser

    //endpoint
)