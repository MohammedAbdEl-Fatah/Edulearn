import { decryptValue } from "../../utils/encrypt";
import { IUser } from "../../utils/interface";

class UserResponse {
    public InfoUser(user: IUser) {
        return {
            fullName: user.firstName + user.lastName,
            phone: decryptValue(user.phone),
            email: user.email,
            dob: user.dob,
            role: user.role
        }

    }
}
export default new UserResponse();