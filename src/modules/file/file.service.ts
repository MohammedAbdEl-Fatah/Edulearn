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
                  res.status(201).json({
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
      };
      //replace file by id => remove old file and build new file for all role with cheak owner
      public replaceFile = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  //id session owner
                  const id = req.params.id;//file id
                  const userID = req.user!.id;
                  const fileUser = req.file;
                  if (!id) throw new AppError("Id is required", 400);
                  //title file is not exist 
                  const fileDB = await this.fileRepo.getOne({ filter: { _id: id, userId: userID } });
                  //cheak owner
                  if (!fileDB) throw new AppError("File is not exist", 404);
                  const exist = await this.fileRepo.getOne({ filter: { title: fileUser?.originalname, userId: userID, _id: { $ne: id } } });
                  if (exist) {
                        throw new AppError("This file is already exist,if you want to upload again please replace the file", 400);
                  }
                  const folder = `edulearn/${userID}/file/${fileDB.sessionId}`
                  const deleteFile = await this.cloudinaryService.deleteFile(fileDB.publicId, fileDB.resourceType);
                  if (!deleteFile) {
                        throw new AppError("Failed to delete file", 500);
                  }
                  const uploadFile: UploadApiResponse = await this.cloudinaryService.uploadFile(fileUser!, folder);
                  console.log(uploadFile);

                  //replace file 
                  await this.fileRepo.updateOne({
                        filter: { _id: id, userId: userID },
                        projection: {
                              $set: {
                                    url: uploadFile.url,
                                    publicId: uploadFile.public_id,
                                    title: fileUser!.originalname
                              }
                        },
                  });
                  // replace url in db
                  const fileReplaced = this.fileFactory.replaceFile(uploadFile, fileDB, fileUser!.originalname);
                  res.status(200).json({
                        success: true,
                        message: "File replaced successfully",
                        data: fileReplaced
                  });
            }
      );
      //post result assenment from teacher for stendent status [wait - result - rebuild ]
      // delete pdf 
      public deleteFile = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  //id session owner
                  const id = req.params.id;//file id
                  const userID = req.user!.id;
                  if (!id) throw new AppError("Id is required", 400);
                  //title file is not exist 
                  const fileDB = await this.fileRepo.getOne({ filter: { _id: id, userId: userID } });
                  //cheak owner
                  if (!fileDB) throw new AppError("File is not exist", 404);

                  const deleteFile = await this.cloudinaryService.deleteFile(fileDB.publicId, fileDB.resourceType);
                  if (!deleteFile) {
                        throw new AppError("Failed to delete file", 500);
                  }

                  await this.fileRepo.deleteOne({
                        filter: { _id: id, userId: userID }, options: {}
                  })
                  res.status(200).json({
                        success: true,
                        message: "File deleted successfully",
                  });
            }
      );



      //!all student what do in session 
      //get all assnenment student 
      //create pdf from student => assenment 
      //get correst from teacher 

}
export default new FileService(new FileRepository(),
      CloudinaryService.getInstance(),
      new fileFactory()
);