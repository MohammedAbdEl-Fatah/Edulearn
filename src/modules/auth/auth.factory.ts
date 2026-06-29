import type { SignUpStudentDTO, SignUpTeacherDTO } from "./auth.dto";
import type { IUser } from "../../utils/interface";
import { RoleUSER } from "../../utils/enum";
import { hashValue } from "../../utils/hash";
import { generateOtp, generateOtpExpire } from "../../utils/generated";
import { encryptValue } from "../../utils/encrypt";
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

}

export default new AuthFactory();
