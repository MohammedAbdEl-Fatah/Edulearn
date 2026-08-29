import { model } from "mongoose";
import { IPdf } from "../../utils/interface";
import { pdfSchema } from "./pdf.schema";
import { ConstentModel } from "../constent";

export const pdfModel = model<IPdf>(ConstentModel.PDF, pdfSchema);