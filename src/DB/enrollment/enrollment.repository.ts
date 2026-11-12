import { IEnrollment } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { enrollmentModel } from "./enrollment.model";

export class EnrollmentRepository extends DatabaseRepository<IEnrollment> {
    constructor() {
        super(enrollmentModel);
    }
}

