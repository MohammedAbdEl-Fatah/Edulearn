import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { isValidationBody } from "../../middleware/validation.middleware";
import authService from "./auth.service";
import authValidation from "./auth.validation";

const router: Router = Router();

/**
 * @openapi
 * /auth/sign-up/student:
 *   post:
 *     summary: Register Student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterStudent'
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post(
    "/sign-up/student",
    isValidationBody(authValidation.registerValidation),
    authService.signUpStudent
);

/**
 * @openapi
 * /auth/sign-up/teacher:
 *   post:
 *     summary: Register Teacher
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterTeacher'
 *     responses:
 *       201:
 *         description: Teacher registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post(
    "/sign-up/teacher",
    isValidationBody(authValidation.registerValidation),
    authService.signUpTeacher
);

/**
 * @openapi
 * /auth/confirm-email:
 *   put:
 *     summary: Confirm Email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmail'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
    "/confirm-email",
    isValidationBody(authValidation.verifyEmailValidation),
    authService.confirmEmail
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "hamo02abdelfatah@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
    "/login",
    isValidationBody(authValidation.loginValidation),
    authService.login
);
/**
 * @openapi
 */

router.patch(
    "/logout",
    authMiddleware,
    authService.logOut
);
/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh Token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: Refresh token successful
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
    "/refresh-token",
    authService.refreshToken
);
/**
 * @openapi
 * /auth/generated-otp:
 *   post:
 *     summary: Generate OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateOtp'
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/generated-otp",
    isValidationBody(authValidation.generateOtpValidation),
    authService.generateOtpForForgetPassword
);

/**
 * @openapi
 * /auth/forget-password:
 *   post:
 *     summary: Reset Password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPassword'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/forget-password",
    isValidationBody(authValidation.forgetPasswordValidation),
    authService.forgetPassword
);

export default router;