import { decryptValue } from "../../utils/encrypt";
import { IUser } from "../../utils/interface";

export interface IUserStats {
    coursesCount?: number;
    completedLessonsCount?: number;
}

class UserResponse {
    public InfoUser(user: IUser, stats?: IUserStats) {
        return {
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            about: user.about || "",
            phone: user.phone ? decryptValue(user.phone) : "",
            email: user.email,
            dob: user.dob,
            role: user.role,
            ...(stats && { stats }),
        };
    }
}

export default UserResponse;
