import { IPdf } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { pdfModel } from "./pdf.model";

export class PdfRepository extends DatabaseRepository<IPdf> {
    constructor() {
        super(pdfModel);
    }
}