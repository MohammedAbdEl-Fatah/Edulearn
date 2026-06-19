import { model } from "mongoose";
import { userSchema } from "./user.schema";
import { IUser } from "../../utils/interface";

export const userModel = model<IUser>("User", userSchema);