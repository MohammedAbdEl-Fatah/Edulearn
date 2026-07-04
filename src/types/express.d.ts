import { IUser } from "../utils/interface";
import 'express';

declare module 'express' {
    interface Request {
        user?: IUser;
    }
}
