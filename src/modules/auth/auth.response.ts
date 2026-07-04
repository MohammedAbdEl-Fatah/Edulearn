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
    public loginResponse(token: { accessToken: string; refreshToken: string }) {
        return {
            success: true,
            message: "Login successful",
            data: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken
            }
        }
    }
}
export default new AuthResponse();