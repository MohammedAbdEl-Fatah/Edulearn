import { encryptValue } from "../../utils/encrypt";
import { RoleUSER, TokenType } from "../../utils/enum";
import { generatedToken, generateOtp, generateOtpExpire } from "../../utils/generated";
import { hashValue } from "../../utils/hash";
import type { IUser } from "../../utils/interface";
import type { SignUpStudentDTO, SignUpTeacherDTO } from "./auth.dto";
class AuthFactory {

    public async signUpStudent(
        body: SignUpStudentDTO
    ): Promise<Omit<IUser, "id">> {
        const studentUser: Omit<IUser, "id"> = {

            firstName: body.fristName,
            lastName: body.lastName,
            role: RoleUSER.STUDENT,
            dob: body.dob,
            email: body.email,
            password: await hashValue(body.password),
            phone: encryptValue(body.phoneNumber),
            isVerified: false,
            otp: encryptValue(generateOtp()),
            otpExpires: generateOtpExpire(4),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return studentUser;
    }


    public async signUpTeacher(
        body: SignUpTeacherDTO
    ): Promise<Omit<IUser, "id">> {
        const teacherUser: Omit<IUser, "id"> = {

            firstName: body.fristName,
            lastName: body.lastName,
            role: RoleUSER.TEACHER,
            dob: body.dob,
            email: body.email,
            password: await hashValue(body.password),
            phone: encryptValue(body.phoneNumber),
            isVerified: false,
            otp: encryptValue(generateOtp()),
            otpExpires: generateOtpExpire(4),
            subjectCourse: body.subjectCourse,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return teacherUser;
    }


    public async generateOtp(): Promise<{ otp: string; otpExpires: Date }> {
        return {
            otp: encryptValue(generateOtp()),
            otpExpires: generateOtpExpire(4)
        };
    }

    public generateToken({ userId, role, email }:
        { userId: string; role: RoleUSER; email: string })
        : { accessToken: string; refreshToken: string } {
        return {
            accessToken: generatedToken({
                data: { userId, role, email },
                roleSecret: role,
                time: "1h",
                tokenType: TokenType.ACCESS
            }),
            refreshToken: generatedToken({
                data: { userId, role, email },
                roleSecret: role,
                time: "7d",
                tokenType: TokenType.REFRESH
            })
        };
    }
}

export default new AuthFactory();
