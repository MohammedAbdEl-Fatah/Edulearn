import { model } from "mongoose";
import { IFile } from "../../utils/interface";
import { fileSchema } from "./file.schema";
import { ConstentModel } from "../constent";

export const fileModel = model<IFile>(ConstentModel.FILE, fileSchema);