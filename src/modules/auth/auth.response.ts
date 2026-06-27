import { IUser } from "../../utils/interface";

class AuthResponse {
    public signUpStudentResponse(user: IUser) {
        return {
            success: true,
            message: "Student signed up successfully",
            data: {
                id: user.id,
                Name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                dob: user.dob,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            }
        }
    }
}
export default new AuthResponse();