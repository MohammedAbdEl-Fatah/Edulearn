import { DatabaseRepository } from "../datebase.repository";
import { IUser } from "../../utils/interface";
import { userModel } from "./user.model";

export class UserRepository extends DatabaseRepository<IUser> {
    constructor() {
        super(userModel);
    }
}
