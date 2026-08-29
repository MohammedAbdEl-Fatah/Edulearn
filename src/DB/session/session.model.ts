import { model } from "mongoose";
import { sessionSchema } from "./session.schema";
import { ConstentModel } from "../constent";

export const sessionModel = model(ConstentModel.SESSION, sessionSchema);