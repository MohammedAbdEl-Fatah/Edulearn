import { NextFunction, Request, Response } from "express";

import { SessionRepository } from "../../DB/session/session.repository";
import { VideoRepository } from "../../DB/video/video.repository";

import { AppError } from "../../error/app.error";
import { asyncHandleError } from "../../error/async.handle";

import { CloudinaryService } from "../../utils/cloud/cloudinary";
import { VideoFactory } from "./video.factory";

class VideoService {
      constructor(
            private readonly sessionRepository: SessionRepository,
            private readonly videoRepository: VideoRepository,
            private readonly videoFactory: VideoFactory,
      ) { }
      public uploadVideo = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  req.setTimeout(10 * 60 * 1000);

                  const sessionId = req.params.id;
                  const userId = req.user?.id;

                  if (!userId) {
                        throw new AppError("User is not authenticated", 401);
                  }
                  if (!sessionId) {
                        throw new AppError("Session id is required", 400);
                  }

                  const sessionDB = await this.sessionRepository.getOne({
                        filter: {
                              _id: sessionId,
                              instructorId: userId,
                        },
                  });

                  if (!sessionDB) {
                        throw new AppError(
                              "Session not found or you are not the instructor",
                              404,
                        );
                  }

                  const files = req.files as Express.Multer.File[] | undefined;

                  if (!files || files.length === 0) {
                        throw new AppError("At least one video is required", 400);
                  }


                  const folder = `edulearn/${userId}/video/${sessionDB.id}`;


                  let nextOrder =
                        await this.getNextOrder(sessionDB.id.toString());

                  const videosDB = [];


                  for (const file of files) {
                        if (!file.buffer) {
                              throw new AppError(
                                    `Invalid video file: ${file.originalname}`,
                                    400,
                              );
                        }

                        const dataFile =
                              await CloudinaryService.getInstance().uploadVideo(
                                    file.buffer,
                                    folder,
                              );

                        const videoFactory = this.videoFactory.createVideo(
                              sessionDB.id,
                              userId,
                              dataFile,
                              file.originalname,
                              nextOrder,
                        );

                        nextOrder++;

                        const videoDB =
                              await this.videoRepository.create(videoFactory);

                        videosDB.push(videoDB);
                  }

                  res.status(201).json({
                        status: "success",
                        message: "Videos uploaded successfully",
                        data: {
                              sessionId: sessionDB.id,
                              videos: videosDB,
                        },
                  });
            },
      );
      async getNextOrder(sessionId: string): Promise<number> {
            const lastVideo = await this.videoRepository.getOne({
                  filter: { sessionId },
                  options: {
                        sort: { order: -1 }
                  }
            });

            return lastVideo ? lastVideo.order + 1 : 0;
      }

      //get all videos
      public getAllVideo = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  const sessionId = req.params.id;
                  const userId = req.user?.id;

                  if (!userId) {
                        throw new AppError("User is not authenticated", 401);
                  }


                  if (!sessionId) {
                        throw new AppError("Session id is required", 400);
                  }


                  const sessionDB = await this.sessionRepository.getOne({
                        filter: {
                              _id: sessionId,
                              instructorId: userId,
                        },
                  });

                  if (!sessionDB) {
                        throw new AppError(
                              "Session not found or you are not the instructor",
                              404,
                        );
                  }

                  const videosDB = await this.videoRepository.getAll({
                        filter: {
                              sessionId: sessionId,
                              instructorId: userId,
                        },

                        projection: {},

                        options: {
                              sort: {
                                    order: 1,
                              },

                              populate: {
                                    path: "instructorId",
                                    select: "firstName lastName email",
                              },
                        },
                  });

                  res.status(200).json({
                        status: "success",
                        message: "Videos fetched successfully",
                        data: {
                              sessionId: sessionDB.id,
                              videos: videosDB,
                        },
                  });
            },
      );

      public getOneVideo = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  const sessionId = req.params.id;
                  const videoId = req.params.idvideo;
                  const userId = req.user?.id;

                  if (!userId) {
                        throw new AppError("User is not authenticated", 401);
                  }

                  if (!sessionId || !videoId) {
                        throw new AppError(
                              "Session id and video id are required",
                              400,
                        );
                  }

                  const sessionDB = await this.sessionRepository.getOne({
                        filter: {
                              _id: sessionId,
                              instructorId: userId,
                        },
                  });

                  if (!sessionDB) {
                        throw new AppError(
                              "Session not found or you are not the instructor",
                              404,
                        );
                  }

                  const videoDB = await this.videoRepository.getOne({
                        filter: {
                              _id: videoId,
                              sessionId,
                              instructorId: userId,
                        },
                        options: {
                              populate: {
                                    path: "instructorId",
                                    select: "firstName lastName email",
                              },
                        },
                  });

                  if (!videoDB) {
                        throw new AppError("Video not found", 404);
                  }

                  res.status(200).json({
                        status: "success",
                        message: "Video fetched successfully",
                        data: videoDB,
                  });
            },
      );


      public deleteVideo = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  const sessionId = req.params.id;
                  const videoId = req.params.idvideo;
                  const userId = req.user?.id;



                  if (!userId) {
                        throw new AppError("User is not authenticated", 401);
                  }


                  if (!sessionId || !videoId) {
                        throw new AppError(
                              "Session id and video id are required",
                              400,
                        );
                  }


                  const sessionDB = await this.sessionRepository.getOne({
                        filter: {
                              _id: sessionId,
                              instructorId: userId,
                        },
                  });

                  if (!sessionDB) {
                        throw new AppError(
                              "Session not found or you are not the instructor",
                              404,
                        );
                  }

                  const videoDB = await this.videoRepository.getOne({
                        filter: {
                              _id: videoId,
                              sessionId,
                              instructorId: userId,
                        },
                  });

                  if (!videoDB) {
                        throw new AppError(
                              "Video not found or does not belong to this session",
                              404,
                        );
                  }


                  await CloudinaryService.getInstance().deleteVideo(
                        videoDB.publicId,
                  );


                  await this.videoRepository.deleteOne({
                        filter: {
                              _id: videoId,
                              sessionId,
                              instructorId: userId,
                        },
                  });


                  res.status(200).json({
                        status: "success",
                        message: "Video deleted successfully",
                  });
            },
      );

      public reorderVideos = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  const sessionId = req.params.id;
                  const userId = req.user?.id;

                  if (!userId) {
                        throw new AppError("User is not authenticated", 401);
                  }

                  if (!sessionId) {
                        throw new AppError("Session id is required", 400);
                  }

                  const sessionDB = await this.sessionRepository.getOne({
                        filter: {
                              _id: sessionId,
                              instructorId: userId,
                        },
                  });

                  if (!sessionDB) {
                        throw new AppError(
                              "Session not found or you are not the instructor",
                              404,
                        );
                  }

                  // -----------------------------------------
                  // Expected body:
                  //
                  // {
                  //   "videos": [
                  //      { "id": "...", "order": 0 },
                  //      { "id": "...", "order": 1 }
                  //   ]
                  // }
                  // -----------------------------------------

                  const { videos } = req.body;

                  if (!Array.isArray(videos) || videos.length === 0) {
                        throw new AppError(
                              "Videos array is required",
                              400,
                        );
                  }


                  for (const video of videos) {
                        if (!video.id || typeof video.order !== "number") {
                              throw new AppError(
                                    "Each video must contain id and order",
                                    400,
                              );
                        }

                        if (video.order < 0) {
                              throw new AppError(
                                    "Video order cannot be negative",
                                    400,
                              );
                        }
                  }


                  for (const video of videos) {
                        const videoDB = await this.videoRepository.getOne({
                              filter: {
                                    _id: video.id,
                                    sessionId,
                                    instructorId: userId,
                              },
                        });

                        if (!videoDB) {
                              throw new AppError(
                                    `Video ${video.id} not found in this session`,
                                    404,
                              );
                        }

                        await this.videoRepository.updateOne({
                              filter: {
                                    _id: video.id,
                                    sessionId,
                                    instructorId: userId,
                              },
                              projection: {
                                    order: video.order,
                              },
                        });
                  }


                  const updatedVideos = await this.videoRepository.getAll({
                        filter: {
                              sessionId,
                              instructorId: userId,
                        },
                        projection: {},
                        options: {
                              sort: {
                                    order: 1,
                              },
                        },
                  });

                  res.status(200).json({
                        status: "success",
                        message: "Videos reordered successfully",
                        data: {
                              sessionId,
                              videos: updatedVideos,
                        },
                  });
            },
      );
}

export default new VideoService(
      new SessionRepository(),
      new VideoRepository(),
      new VideoFactory(),
);