import { model } from "mongoose";
import { userSchema } from "./user.schema";
import { IUser } from "../../utils/interface";
import { ContentModel } from "../constent";

export const userModel = model<IUser>(ContentModel.USER, userSchema);