import { Router } from "express";
import { isValidationBody } from "../../middleware/validation.middleware";
import authService from "./auth.service";
import authValidation from "./auth.validation";
const router: Router = Router();
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
export default router;