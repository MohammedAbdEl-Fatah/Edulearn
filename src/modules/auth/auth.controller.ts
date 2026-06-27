import { Request, Response, Router } from "express";
import authService from "./auth.service";
const router: Router = Router();
router.post("/sign-up/student", (req: Request, res: Response) => {
    console.log("Sign up student::::::");
    authService.signUpStudent(req, res);
});
export default router;