import { NextFunction, Request, Response } from "express";
import { asyncHandleError } from "../../error/async.handle";
import { FileRepository } from "../../DB/file/file.repository";
import { CloudinaryService } from "../../utils/cloud/cloudinary";
import { AppError } from "../../error/app.error";
import { UploadApiResponse } from "cloudinary";
import fileFactory from "./file.factory";
import { IFile } from "../../utils/interface";

class FileService {

      constructor(private readonly fileRepo: FileRepository,
            private readonly cloudinaryService: CloudinaryService,
            private readonly fileFactory: fileFactory
      ) { }

      //create pdf from teacher
      public createFile = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  const userId = req.user!.id;
                  const sessionId = req.params.id;
                  const fileUser = req.file;
                  if (!sessionId) {
                        throw new AppError("Session is required", 400);
                  }
                  if (!fileUser) {

                        throw new AppError("File is required", 400);
                  }
                  const existName = await this.fileRepo.getOne({ filter: { title: fileUser?.originalname, userId: userId } })//user is owner of files
                  if (existName) {
                        throw new AppError("This file is already exist,if you want to upload again please replace the file");
                  }

                  const folder = `edulearn/${userId}/file/${sessionId}`
                  //file in  cloud
                  const uploadFile: UploadApiResponse = await this.cloudinaryService.uploadFile(fileUser, folder);
                  let nextOrder =
                        await this.getNextOrder(sessionId.toString());
                  //factory
                  const createdFile = this.fileFactory.createFile(userId, sessionId.toString(), uploadFile, fileUser.originalname, nextOrder);
                  //saving DB 
                  const fileInDb = await this.fileRepo.create(createdFile as IFile);
                  //reposne
                  res.json({
                        success: true,
                        message: "File created successfully",
                        data: fileInDb
                  });
            }


      );
      async getNextOrder(sessionId: string): Promise<number> {
            const lastVideo = await this.fileRepo.getOne({
                  filter: { sessionId },
                  options: {
                        sort: { order: -1 }
                  }
            });

            return lastVideo ? lastVideo.order + 1 : 0;
      }
      //replace file by id => remove old file and build new file for all role with cheak owner
      //create pdf from student => assenment 
      //get all assnenment student 
      //post result assenment from teacher for stendent status [wait - result - rebuild ]
      //get correst from teacher 
      // delete pdf 

}
export default new FileService(new FileRepository(),
      CloudinaryService.getInstance(),
      new fileFactory()
);