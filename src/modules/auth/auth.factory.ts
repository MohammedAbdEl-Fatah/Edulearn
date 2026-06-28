import type { SignUpStudentDTO } from "./auth.dto";
import type { IUser } from "../../utils/interface";
import { RoleUSER } from "../../utils/enum";
import { hashValue } from "../../utils/hash";
import { generateOtp, generateOtpExpire } from "../../utils/generated";
class AuthFactory {

    async signUpStudent(
        body: SignUpStudentDTO
    ): Promise<Omit<IUser, "id">> {
        const studentUser: Omit<IUser, "id"> = {

            firstName: body.fristName,
            lastName: body.lastName,
            role: RoleUSER.STUDENT,
            dob: body.dob,
            email: body.email,
            password: await hashValue(body.password),
            phone: body.phoneNumber,
            isVerified: false,
            otp: generateOtp(),
            otpExpires: generateOtpExpire(4),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return studentUser;
    }
}

export default new AuthFactory();
