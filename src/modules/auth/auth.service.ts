import { Request, Response } from "express";
import { ConfirmOtpDTO, LoginDTO, SignUpStudentDTO, SignUpTeacherDTO } from "./auth.dto";
import AuthFactory from "./auth.factory";
import { IUser } from "../../utils/interface";
import { UserRepository } from "../../DB/user/user.repository";
import AuthResponse from "./auth.response";

import sendEmail from "../../utils/email";
import verifyEmailTemplate from "../../utils/email/temp/verify.email";
import { decryptValue } from "../../utils/encrypt";
import { compareValue } from "../../utils/hash";
import { RoleUSER } from "../../utils/enum";
import { TokenRepository } from "../../DB/token/token.repository";
class AuthenticationService {
    constructor(
        private readonly authFactory: typeof AuthFactory,
        private readonly userRepository: UserRepository,
        private readonly authResponse: typeof AuthResponse,
        private readonly tokenRepository: TokenRepository
    ) { }

    private sendMaillerVerify = async ({ email, otp, otpExpires }: { email: string; otp: string; otpExpires: Date }) => {
        const remendOtpExpire = Math.ceil(
            (otpExpires.getTime() - Date.now()) / (1000 * 60)
        );
        await sendEmail({
            email: email,
            subject: "Verify Email",
            text: "Verify Email",
            html: verifyEmailTemplate(email, otp, remendOtpExpire)
        });
    }

    //Sign Up student
    public signUpStudent = async (req: Request, res: Response) => {
        console.log("body:", req.body);
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
        //TODO validation 
        if (reqestBodyDTO.confirmPassword !== reqestBodyDTO.password) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            });
        }
        //factory
        const studentFactory: Omit<IUser, "id"> = await this.authFactory.signUpStudent(reqestBodyDTO);
        //saving to DB
        const user = await this.userRepository.create(studentFactory as IUser);

        const userResponse = this.authResponse.signUpStudentResponse(user);
        await this.sendMaillerVerify({
            email: user.email,
            otp: decryptValue(user.otp),
            otpExpires: user.otpExpires
        });

        return res.status(201).json(userResponse);
    }
    //Sign Up teacher 
    public signUpTeacher = async (req: Request, res: Response) => {
        const reqestBodyDTO: SignUpTeacherDTO = req.body;

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
        //TODO validation 
        if (reqestBodyDTO.confirmPassword !== reqestBodyDTO.password) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            });
        }
        //factory
        const teacherFactory: Omit<IUser, "id"> = await this.authFactory.signUpTeacher(reqestBodyDTO);
        //saving to DB
        const user = await this.userRepository.create(teacherFactory as IUser);

        const userResponse = this.authResponse.signUpTeacherResponse(user);
        await this.sendMaillerVerify({
            email: user.email,
            otp: decryptValue(user.otp),
            otpExpires: user.otpExpires
        });

        return res.status(201).json(userResponse);

    };


    //Sign up Student with Google
    //Sign up Teacher with Google

    //confrim Email Student or Teacher 
    public confirmEmail = async (req: Request, res: Response) => {
        const confirmOtpDTO: ConfirmOtpDTO = req.body;
        //* more scures - check from db include value or throw error if not found
        //email exist 
        const exist = await this.userRepository.getOne({ filter: { email: confirmOtpDTO.email } });

        if (!exist) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (exist.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already verified"
            });
        }
        //check otp expire or not //outomatic generated otp
        if (exist.otpExpires < new Date()) {

            //factory saving new otp
            const otpFactory = await this.authFactory.generateOtp();
            await this.userRepository.updateOne({
                filter: { email: confirmOtpDTO.email },
                projection: { $set: { otp: otpFactory.otp, otpExpires: otpFactory.otpExpires } }
            });

            await this.sendMaillerVerify({
                email: confirmOtpDTO.email,
                otp: decryptValue(otpFactory.otp),
                otpExpires: otpFactory.otpExpires
            });
            return res.status(400).json({
                success: false,
                message: "OTP expired, we sent new OTP to your email"
            });
        }
        //compere otp 
        const otp = decryptValue(exist.otp);
        console.log("Decrypted OTP:", otp);
        console.log("Provided OTP:", confirmOtpDTO.otp);
        console.log("Are they equal?", otp === confirmOtpDTO.otp);
        if (otp !== confirmOtpDTO.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        //check if user is already verified

        //edit verified email 
        await this.userRepository.updateOne({
            filter: { email: confirmOtpDTO.email },
            projection: {
                $set: { isVerified: true },
                $unset: { otp: 1, otpExpires: 1 }
            }
        });
        //response
        const response = this.authResponse.confirmOtpResponse();
        return res.status(200).json(response);
    }

    //Login for student or teacher 
    public login = async (req: Request, res: Response) => {
        //DTO login {email / password }
        const loginDTO: LoginDTO = req.body;
        // check email exist
        const exist = await this.userRepository.getOne({ filter: { email: loginDTO.email } });
        // emails is verify 
        if (!exist) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (!exist.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User not verified"
            });
        }
        // match password 
        const isPasswordMatch = await compareValue({ value: loginDTO.password, hash: exist.password });
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }
        //factory  generate token with role  - student | teacher
        const token = this.authFactory.generateToken({ userId: exist.id, role: exist.role as RoleUSER, email: exist.email });
        // saving token refresh in DB
        await this.tokenRepository.create({
            userId: exist.id,
            role: exist.role,
            token: token.refreshToken,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        } as any);
        // response    
        return res.status(200).json(this.authResponse.loginResponse(token));
    }


    //Reset Password
    //Forget Password 
    // refresh Token Role
    // Logout with revoke token 
    public logOut = async (req: Request, res: Response) => {

        //TODO think about revoke token time to cronJob???
        const revokeToken = req.headers.authorization?.split(" ")[1];
        if (revokeToken) {
            // revoke token
            await this.tokenRepository.updateOne({ filter: { token: revokeToken }, projection: { $set: { isRevoked: true } } });
        }
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
        //TODO cronJob delete Token is revoked or expire Token
    };
}


export default new AuthenticationService(AuthFactory, new UserRepository(), AuthResponse, new TokenRepository());
