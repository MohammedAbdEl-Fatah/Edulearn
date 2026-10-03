import { Types } from "mongoose";
import { IFile } from "../../utils/interface";
import { UploadApiResponse } from "cloudinary";
import { TypeAssenment } from "../../utils/enum";

class FileFactory {
      public createFile(
            userId: string | Types.ObjectId,
            sessionId: string | Types.ObjectId,
            item: UploadApiResponse,
            title: string,
            order: number,
            typeAssenment: TypeAssenment,
            presentId?: Types.ObjectId): Partial<IFile> {
            return {
                  sessionId: sessionId as Types.ObjectId,
                  userId: userId as Types.ObjectId,
                  presentId: presentId ? presentId : undefined,
                  title,
                  url: item.url,
                  publicId: item.public_id,
                  resourceType: item.resource_type,
                  typeAssenment: typeAssenment ?? TypeAssenment.VIEW,
                  order,
                  createdAt: new Date(),
                  updatedAt: new Date(),
            }
      }
      public replaceFile(item: UploadApiResponse, oldIteam: IFile, title: string): Partial<IFile> {
            return {
                  sessionId: oldIteam.sessionId,
                  userId: oldIteam.userId,
                  title,
                  url: item.url,
                  publicId: item.public_id,
                  resourceType: item.resource_type,
                  order: oldIteam.order,
                  createdAt: oldIteam.createdAt,
                  updatedAt: new Date(),
            }
      }

      public correctResult(result: { grade: number, feedback: string }, oldIteam: IFile): Partial<IFile> {
            return {
                  sessionId: oldIteam.sessionId,
                  userId: oldIteam.userId,
                  presentId: oldIteam.presentId,
                  title: oldIteam.title,
                  url: oldIteam.url,
                  publicId: oldIteam.publicId,
                  resourceType: oldIteam.resourceType,
                  order: oldIteam.order,
                  createdAt: oldIteam.createdAt,
                  updatedAt: new Date(),
                  grade: result.grade,
                  feedback: result.feedback,
            }
      }
}
export default FileFactory;