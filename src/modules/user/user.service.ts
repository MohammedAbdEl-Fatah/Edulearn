import { Request, Response } from "express";
import UserResponse from "./user.response";

class UserService {
    constructor(private userResponse: typeof UserResponse) { }

    public getInformationUser(req: Request, res: Response) {
        const responseInfoUser = this.userResponse.InfoUser(req.user!);
        return res.status(200).json({ message: "Information user", data: responseInfoUser });
    }
    
}

export const userService = new UserService(UserResponse);