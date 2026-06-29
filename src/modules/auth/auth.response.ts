import { decryptValue } from "../../utils/encrypt";
import { IUser } from "../../utils/interface";

class AuthResponse {
    public signUpStudentResponse(user: IUser) {
        return {
            success: true,
            message: "Successfully Registered, Please verify your email",
            data: {
                id: user.id,
                Name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                dob: user.dob,
                //TODO Fix issue problem why value phone can't decryto in result but otp was work.
                phone: decryptValue(user.phone),
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            }
        }
    }


    public signUpTeacherResponse(user: IUser) {
        console.log("User:", user);
        return {
            success: true,
            message: "Successfully Registered, Please verify your email",
            data: {
                id: user.id,
                Name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                dob: user.dob,
                //TODO Fix issue problem why value phone can't decryto in result but otp was work.
                phone: decryptValue(user.phone),
                role: user.role,
                isVerified: user.isVerified,
                subjectCourse: user.subjectCourse,
                createdAt: user.createdAt,
            }
        }
    }
    
    public confirmOtpResponse() {
        return {
            success: true,
            message: "Email verified successfully"
        }
    }
}
export default new AuthResponse();