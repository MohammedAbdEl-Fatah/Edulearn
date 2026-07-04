import { Request, Response } from "express";

class UserService {
    constructor() { }

    public getInformationUser(req: Request, res: Response) {
        //information user id from request 
        console.log(req.user);
        return res.status(200).json({ message: "Information user", data: req.user });
    }
}

export const userService = new UserService();