import { Request, Response } from "express";
import { SignUpStudentDTO } from "./auth.dto";
import AuthFactory from "./auth.factory";
import { IUser } from "../../utils/interface";
import { UserRepository } from "../../DB/user/user.repository";
import AuthResponse from "./auth.response";

import sendEmail from "../../utils/email";
import verifyEmailTemplate from "../../utils/email/temp/verify.email";
class AuthenticationService {
    constructor(private readonly authFactory: typeof AuthFactory, private readonly userRepository: UserRepository, private readonly authResponse: typeof AuthResponse) {

    }
    //Login for student or teacher 

    //Sign Up student
    public signUpStudent = async (req: Request, res: Response) => {
        const reqestBodyDTO: SignUpStudentDTO = req.body;

        if (!reqestBodyDTO.email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const userExaite = await this.userRepository.getOne({ filter: { email: reqestBodyDTO.email } });
        if (userExaite) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        if (reqestBodyDTO.confirmPassword !== reqestBodyDTO.password) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            });
        }
        console.log(reqestBodyDTO);
        //factory
        const studentFactory: Omit<IUser, "id"> = await this.authFactory.signUpStudent(reqestBodyDTO);
        //saving to DB
        const user = await this.userRepository.create(studentFactory as IUser);

        const userResponse = this.authResponse.signUpStudentResponse(user);
        const remendOtpExpire = Math.ceil(
            (user.otpExpires.getTime() - Date.now()) / (1000 * 60)
        );
        await sendEmail({
            email: user.email,
            subject: "Verify Email",
            text: "Verify Email",
            html: verifyEmailTemplate(`${user.firstName} ${user.lastName}`, user.otp, remendOtpExpire)
        });

        return res.status(201).json(userResponse);
    }
    //Sign Up teacher 
    public signUpTeacher = (req: Request, res: Response) => { }


    //Sign up Student with Google
    //Sign up Teacher with Google

    //confrim Email Student or Teacher 
    //Reset Password
    //Forget Password 
    // refresh Token Role
    // Logout with revoke token 
}


export default new AuthenticationService(AuthFactory, new UserRepository(), AuthResponse);
