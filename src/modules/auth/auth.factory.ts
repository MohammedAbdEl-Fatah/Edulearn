import type { SignUpStudentDTO } from "./auth.dto";
import type { IUser } from "../../utils/interface";
import { RoleUSER } from "../../utils/enum";
import { hashValue } from "../../utils/hash";
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
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log(`body in factory ${JSON.stringify(body)}`);
        return studentUser;
    }
}

export default new AuthFactory();
