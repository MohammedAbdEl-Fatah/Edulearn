import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { isValidationBody } from "../../middleware/validation.middleware";
import userValidation from "./use.validation";
import userService from "./user.service";

export const userController = Router();

/**
 * @openapi
 * /user/profile:
 *   get:
 *     summary: Get logged-in user profile information and statistics
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

/**
 * @openapi
 * /user/edit-profile:
 *   patch:
 *     summary: Edit profile (name, about)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               about:
 *                 type: string
 *                 example: "Passionate software engineer and lifelong learner."
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
userController.patch(
    "/edit-profile",
    authMiddleware,
    isValidationBody(userValidation.editProfile),
    userService.editProfile
);
