import { Types } from "mongoose";
import { IVideo } from "../../utils/interface";

export class VideoFactory {
      constructor() { }
      //create video
      public createVideo = (
            sessionId: Types.ObjectId | string,
            instructorId: Types.ObjectId | string,
            item: any,
            originalname: string,
            order: number
      ) => {
            var video: IVideo = {
                  sessionId: new Types.ObjectId(sessionId),
                  instructorId: new Types.ObjectId(instructorId),
                  title: originalname,
                  url: item.secure_url,
                  order: order,
                  publicId: item.public_id,
                  resourceType: item.resource_type,
                  format: item.format,
                  size: (item.bytes / 1024 / 1024).toFixed(2) + "MB",// as like 28MB || 34MB
                  duration: item.duration,// as like 90.154646
                  createdAt: new Date(),
                  updatedAt: new Date(),
            };
            return video;
      }
}