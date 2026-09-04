import { Request, Response } from "express";
import UserResponse from "./user.response";

class UserService {
    constructor(private readonly userResponse: UserResponse) { }

    public getInformationUser = (req: Request, res: Response) => {


        const responseInfoUser = this.userResponse.InfoUser(req.user!);
        return res.status(200).json({ message: "Information user", data: responseInfoUser });
    }

}

export default new UserService(new UserResponse());