import { model } from "mongoose";
import { IToken } from "../../utils/interface";
import { tokenSchema } from "./token.schema";

export const tokenModel = model<IToken>("Token", tokenSchema);