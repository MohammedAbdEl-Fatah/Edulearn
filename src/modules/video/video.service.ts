import { NextFunction, Request, Response } from "express";
import { SessionRepository } from "../../DB/session/session.repository";
import { AppError } from "../../error/app.error";
import { asyncHandleError } from "../../error/async.handle";
import { CloudinaryService } from "../../utils/cloud/cloudinary";
import { VideoRepository } from "../../DB/video/video.repository";
import { VideoFactory } from "./video.factory";


class VideoService {
      constructor(
            private readonly sessionRepository: SessionRepository,
            private readonly videoRepository: VideoRepository,
            private readonly videoFactory: VideoFactory,

      ) { }
      //upload video
      public uploadVideo = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  req.setTimeout(10 * 60 * 1000);
                  //check session exist  with userID in session db
                  const id: string = req.params.id as string;
                  console.log(req.user?.id);
                  if (!id) {
                        throw new AppError("Id is required", 400);
                  }
                  const sessionDB = await this.sessionRepository.getOne({
                        filter: {
                              _id: id,
                              instructorId: req.user?.id
                        }
                  });
                  if (!sessionDB) {
                        throw new AppError("Session not found", 404);
                  }

                  const folder: string = `edulearn/${req.user?.id}/video/${sessionDB.id}`
                  console.log(folder);

                  //upload it for claudinary
                  const files = req.files as Express.Multer.File[];
                  const videoFile = files?.[0];
                  if (!videoFile) {
                        throw new AppError("Video file is required", 400);
                  }
                  const videosDB = [];
                  let i: number = 0;
                  for (const file of files) {
                        const dataFile = await CloudinaryService.getInstance().uploadVideo(file.buffer, folder);
                        console.log(dataFile);
                        //factory
                        const videoFactory = this.videoFactory.createVideo(sessionDB.id, req.user!.id, dataFile, file.originalname, i++);
                        //saving url in db and don't make 2 loop 
                        const videoDB = await this.videoRepository.create(videoFactory);
                        videosDB.push(videoDB);//for we can reposne to frontend
                  }
                  //reponse
                  res.status(201).json(
                        {
                              status: "success",
                              message: "Video uploaded successfully",
                              data: {
                                    session: id,
                                    videos: videosDB
                              }
                        }
                  );
            }
      );
      //download video'
      //get video
      //delete video
}

export default new VideoService(new SessionRepository(), new VideoRepository(), new VideoFactory());