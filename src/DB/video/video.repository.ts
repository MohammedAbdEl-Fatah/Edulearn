import { IVideo } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { videoModel } from "./video.model";

export class VideoRepository extends DatabaseRepository<IVideo> {
    constructor() {
        super(videoModel);
    }
}