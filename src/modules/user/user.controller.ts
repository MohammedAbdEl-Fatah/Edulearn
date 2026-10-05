import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import userService from "./user.service";

export const userController = Router();

/**
 * @openapi
 * /user/profile:
 *   get:
 *     summary: Get logged-in user profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userController.get(
    "/profile",
    authMiddleware,
    userService.getInformationUser
);