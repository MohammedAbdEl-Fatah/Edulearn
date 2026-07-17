import { Router } from "express";
import { isValidationBody } from "../../middleware/validation.middleware";
import authService from "./auth.service";
import authValidation from "./auth.validation";
import { authMiddleware } from "../../middleware/auth,middleware";
const router: Router = Router();
/**
 * @api {post} /auth/sign-up/student Sign Up Student
 * @apiName SignUpStudent
 * @apiGroup Auth
 * @apiVersion 1.0.0
 */
router.post(
    "/sign-up/student",
    isValidationBody(authValidation.registerValidation),
    authService.signUpStudent
);

router.post(
    "/sign-up/teacher",
    isValidationBody(authValidation.registerValidation),
    authService.signUpTeacher
);

router.put(
    "/confirm-email",
    isValidationBody(authValidation.verifyEmailValidation),
    authService.confirmEmail
);

router.post(
    "/login",
    isValidationBody(authValidation.loginValidation),
    authService.login
);
router.patch(
    "/logout",
    authMiddleware,
    authService.logOut
);
router.post(
    "/refresh-token",
    authService.refreshToken
);
router.post("/generated-otp", isValidationBody(authValidation.generateOtpValidation), authService.generateOtpForForgetPassword);
router.post("/forget-password", isValidationBody(authValidation.forgetPasswordValidation), authService.forgetPassword);
export default router;