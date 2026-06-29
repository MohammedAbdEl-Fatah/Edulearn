import { Request, Response, Router } from "express";
import authService from "./auth.service";
const router: Router = Router();
router.post("/sign-up/student", (req: Request, res: Response) => {

    authService.signUpStudent(req, res);
});
router.post("/sign-up/teacher", (req: Request, res: Response) => {

    authService.signUpTeacher(req, res);
});
router.put("/confirm-email", (req: Request, res: Response) => {

    authService.confirmEmail(req, res);
});
router.post("/login", (req: Request, res: Response) => {

    authService.login(req, res);
});
export default router;