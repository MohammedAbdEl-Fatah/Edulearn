import { IReview } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { reviewModel } from "./review.model";

export class ReviewRepository extends DatabaseRepository<IReview> {
    constructor() {
        super(reviewModel);
    }
}