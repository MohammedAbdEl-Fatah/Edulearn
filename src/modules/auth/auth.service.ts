import { Request, Response } from "express";
import * as AuthDTO from "./auth.dto";
import AuthFactory from "./auth.factory";
import { IToken, IUser } from "../../utils/interface";
import { UserRepository } from "../../DB/user/user.repository";
import AuthResponse from "./auth.response";
import jwt from "jsonwebtoken";

import sendEmail from "../../utils/email";
import verifyEmailTemplate from "../../utils/email/temp/verify.email";
import { decryptValue } from "../../utils/encrypt";
import { compareValue } from "../../utils/hash";
import { EmailType, RoleUSER } from "../../utils/enum";
import { TokenRepository } from "../../DB/token/token.repository";
import { verifyToken } from "../../middleware/auth,middleware";
import { TokenSecret } from "../../utils/generated";
class AuthenticationService {
    constructor(
        private readonly authFactory: typeof AuthFactory,
        private readonly userRepository: UserRepository,
        private readonly authResponse: typeof AuthResponse,
        private readonly tokenRepository: TokenRepository
    ) { }

    private sendMaillerVerify = async ({ type, email, otp, otpExpires }: { type: string; email: string; otp: string; otpExpires: Date }) => {
        const remendOtpExpire = Math.ceil(
            (otpExpires.getTime() - Date.now()) / (1000 * 60)
        );
        switch (type) {
            case EmailType.VERIFY:
                await sendEmail({
                    email: email,
                    subject: "Verify Email",
                    text: "Verify Email",
                    html: verifyEmailTemplate(email, otp, remendOtpExpire)
                });
                break;
            case EmailType.FORGOT:
                await sendEmail({
                    email: email,
                    subject: "Forgot Password",
                    text: "Forgot Password",
                    html: verifyEmailTemplate(email, otp, remendOtpExpire)
                });
                break;

            default:
                break;
        }

    }


    //Sign Up student
    public signUpStudent = async (req: Request, res: Response) => {
        console.log("body:", req.body);
        const reqestBodyDTO: AuthDTO.SignUpStudentDTO = req.body;

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
            type: EmailType.VERIFY,
            email: user.email,
            otp: decryptValue(user.otp),
            otpExpires: user.otpExpires
        });

        return res.status(201).json(userResponse);
    }
    //Sign Up teacher 
    public signUpTeacher = async (req: Request, res: Response) => {
        const reqestBodyDTO: AuthDTO.SignUpTeacherDTO = req.body;

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
            type: EmailType.VERIFY,
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
        const confirmOtpDTO: AuthDTO.ConfirmOtpDTO = req.body;
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
            const otpFactory = await this.authFactory.generateOtp({ time: 5 });
            await this.userRepository.updateOne({
                filter: { email: confirmOtpDTO.email },
                projection: { $set: { otp: otpFactory.otp, otpExpires: otpFactory.otpExpires } }
            });

            await this.sendMaillerVerify({

                type: EmailType.VERIFY,
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
        const loginDTO: AuthDTO.LoginDTO = req.body;
        // check email exist
        const exist = await this.userRepository.getOne({ filter: { email: loginDTO.email, isVerified: true } });
        // emails is verify 
        if (!exist) {
            return res.status(404).json({
                success: false,
                message: "User not found"
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

    //generated otp for forget password
    public generateOtpForForgetPassword = async (
        req: Request, res: Response
    ) => {
        //email is exist or not and confirm 
        const generatedOtpDTO: AuthDTO.GeneratedOTPDTO = req.body;
        const exist = await this.userRepository.getOne({ filter: { email: generatedOtpDTO.email, isVerified: true } });
        if (!exist) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // generate otp
        const otpFactory = await this.authFactory.generateOtp({ time: 6 });
        // send otp to email
        await this.sendMaillerVerify({
            type: EmailType.FORGOT,
            email: generatedOtpDTO.email,
            otp: decryptValue(otpFactory.otp),
            otpExpires: otpFactory.otpExpires
        });
        // save otp in db in user collection 
        await this.userRepository.updateOne({
            filter: { email: generatedOtpDTO.email },
            projection: { $set: { otp: otpFactory.otp, otpExpires: otpFactory.otpExpires } }
        });
        // return success
        return res.status(200).json({
            success: true,
            message: "OTP generated successfully"
        });
    };
    //Forget Password 

    public forgetPassword = async (
        req: Request, res: Response
    ) => {
        // email is exist or not and confirm
        const forgetPasswordDTO: AuthDTO.ForgetPasswordDTO = req.body;
        const exist = await this.userRepository.getOne({ filter: { email: forgetPasswordDTO.email, isVerified: true } });
        if (!exist) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        //otp is not expire 
        if (exist.otpExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }
        // otp match 

        if (decryptValue(exist.otp) !== forgetPasswordDTO.otp) {
            return res.status(400).json({
                success: false,
                message: "OTP not match"
            });
        }
        // factory password 
        const newPassword = await this.authFactory.newPassword(forgetPasswordDTO.newPassword);
        // update password in DB 
        await this.userRepository.updateOne({
            filter: { email: forgetPasswordDTO.email },
            projection: { $set: { password: newPassword } }
        });
        // responce
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    };



    // refresh Token Role
    public refreshToken = async (
        req: Request, res: Response
    ) => {
        // no there middleware 
        // get token from headers type refresh Token
        const [schemaAuth, token] = req.headers.authorization?.split(" ") || [];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        if (
            schemaAuth !== RoleUSER.TEACHER &&
            schemaAuth !== RoleUSER.STUDENT
        ) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        //verify token 
        let payloadUser: jwt.JwtPayload & IToken;
        if (schemaAuth === RoleUSER.TEACHER) {
            payloadUser = verifyToken(
                token,
                TokenSecret.secretUserTeacherRefreshToken
            ) as jwt.JwtPayload & IToken;
        } else {
            payloadUser = verifyToken(
                token,
                TokenSecret.secretUserStudentRefreshToken
            ) as jwt.JwtPayload & IToken;
        }
        // exist token from datebase
        const [tokenInDB, user] = await Promise.all([
            this.tokenRepository.getOne({ filter: { token, role: payloadUser.role } }),
            this.userRepository.getOne({ filter: { _id: payloadUser.userId } }),
        ]);
        if (!tokenInDB) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (tokenInDB.isRevoked) {
            return res.status(403).json({ message: "Token revoked" });
        }
        if (tokenInDB.expires.getTime() < Date.now()) {
            return res
                .status(403)
                .json({ message: "Refresh token expired, you need login again" });
        }
        if (!user) {
            return res.status(403).json({ message: "User not exist" });
        }
        //factory generated token 

        const newToken = this.authFactory.generateToken({ userId: user.id, role: user.role as RoleUSER, email: user.email });


        //update token
        await this.tokenRepository.create({
            userId: user.id,
            role: user.role,
            token: newToken.refreshToken,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        } as any);
        // response
        return res.status(200).json({
            success: true,
            message: "Refresh token successful",
            token: newToken
        });
    };
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
