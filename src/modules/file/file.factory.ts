import { Types } from "mongoose";
import { IFile } from "../../utils/interface";
import { UploadApiResponse } from "cloudinary";

class FileFactory {
      public createFile(userId: string | Types.ObjectId, sessionId: string | Types.ObjectId, item: UploadApiResponse, title: string, order: number): Partial<IFile> {
            return {
                  sessionId: sessionId as Types.ObjectId,
                  userId: userId as Types.ObjectId,
                  title,
                  url: item.url,
                  publicId: item.public_id,
                  resourceType: item.resource_type,
                  order,
                  createdAt: new Date(),
                  updatedAt: new Date(),
            }
      }
}
export default FileFactory;