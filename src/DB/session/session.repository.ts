import { IPdf } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { pdfModel } from "../pdf/pdf.model";

export class SessionRepository extends DatabaseRepository<IPdf> {
    constructor() {
        super(pdfModel);
    }
}