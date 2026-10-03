import { UploadApiResponse } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { FileRepository } from "../../DB/file/file.repository";
import { AppError } from "../../error/app.error";
import { asyncHandleError } from "../../error/async.handle";
import { CloudinaryService } from "../../utils/cloud/cloudinary";
import { RoleUSER, TypeAssenment } from "../../utils/enum";
import { IFile } from "../../utils/interface";
import fileFactory from "./file.factory";

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
                  const typeAssenment = req.body.typeAssenment;

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
                  const createdFile = this.fileFactory.createFile(userId, sessionId.toString(), uploadFile, fileUser.originalname, nextOrder, typeAssenment);
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
      //!post result assenment from teacher for stendent status [wait - result - rebuild ]
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
      //teacher get all submit assignment
      public getAllsubmitAssignment = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  const id = req.params.id; //id file assignment

                  const files = await this.fileRepo.getAll({
                        filter: { _id: id, },
                        options: {
                              sort: {
                                    createdAt: -1
                              },
                        }
                  });
                  if (!files) {
                        throw new AppError("Files not found", 404);
                  }
                  res.status(200).json({
                        success: true,
                        message: "Files fetched successfully",
                        data: files
                  });
            }
      );
      // correst assignment for student
      public correstAsssignment = asyncHandleError(
            async (
                  req: Request, res: Response, next: NextFunction
            ) => {
                  //id file student 
                  const id = req.params.id;
                  const result: { grade: number, feedback: string } = req.body;
                  if (!id) throw new AppError("Id is required", 400);
                  const fileDB = await this.fileRepo.getOne({ filter: { _id: id } });
                  //cheak owner
                  if (!fileDB) throw new AppError("File is not exist", 404);
                  await this.fileRepo.updateOne({ filter: { _id: id }, projection: { $set: { grade: result.grade, feedback: result.feedback, status: TypeAssenment.CORRECTED, updatedAt: Date.now() } } });
                  const updatedfile = this.fileFactory.correctResult(result, fileDB);//for response
                  res.status(200).json({
                        success: true,
                        message: "File corrected successfully",
                        data: updatedfile
                  });
            }
      );


      //!all student what do in session 
      //get all assnenment student 
      public getAllfilesSession = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  // const userId = req.user!.id;//id student
                  const teacherId = req.params.teacherId;//id teacher
                  const sessionId = req.params.id;//id session 
                  //todo::payment  => check student has course from teacher in DB of Payment 
                  if (!sessionId) {
                        throw new AppError("Session is required", 400);
                  }
                  //check owner teacher 
                  if (req.user?.role === RoleUSER.TEACHER) {
                        if (req.user!.id.toString() !== teacherId) {
                              throw new AppError("Forbidden", 403);
                        }
                  }
                  const files = await this.fileRepo.getAll({ filter: { sessionId, userId: teacherId }, options: { projection: {} } });
                  if (!files) {
                        throw new AppError("Files not found", 404);
                  }
                  res.status(200).json({
                        success: true,
                        message: "Files fetched successfully",
                        data: files
                  });
            }
      );
      //create pdf from student => assenment 
      public submitAssenment = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  const userId = req.user!.id; // id student
                  const SessionID = req.params.id;// id file assenment
                  const assenmentId = req.params.idAssenment;// id file assenment
                  const fileUser = req.file;
                  if (!SessionID) {
                        throw new AppError("session id or id assenment is required", 400);
                  }
                  if (!fileUser) {

                        throw new AppError("File is required", 400);
                  }
                  const existName = await this.fileRepo.getOne({ filter: { title: fileUser?.originalname, userId: userId } })//user is owner of files
                  if (existName) {
                        throw new AppError("This file is already exist,if you want to upload again please replace the file");
                  }

                  const folder = `edulearn/${userId}/file/${SessionID}`
                  //file in  cloud
                  const uploadFile: UploadApiResponse = await this.cloudinaryService.uploadFile(fileUser, folder);
                  let nextOrder =
                        await this.getNextOrder(SessionID.toString());
                  //factory
                  const createdFile = this.fileFactory.createFile(
                        userId,
                        SessionID.toString(),
                        uploadFile,
                        fileUser.originalname,
                        nextOrder,
                        TypeAssenment.ANSWERASSIGNMENT,
                        assenmentId as unknown as Types.ObjectId);
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
      //get correst from teacher 
      public getCorrestFile = asyncHandleError(
            async (req: Request, res: Response, next: NextFunction) => {
                  const id = req.params.id;
                  const userID = req.user!.id;
                  if (!id) throw new AppError("Id is required", 400);
                  const fileDB = await this.fileRepo.getOne({ filter: { _id: id, userId: userID }, projection: {} });
                  if (!fileDB) throw new AppError("File is not exist", 404);
                  res.status(200).json({
                        success: true,
                        message: "File fetched successfully",
                        data: {
                              id: fileDB.id,
                              url: fileDB.url,
                              grade: fileDB.grade,
                              feedback: fileDB.feedback,
                        }
                  })
            }
      );

}
export default new FileService(new FileRepository(),
      CloudinaryService.getInstance(),
      new fileFactory()
);