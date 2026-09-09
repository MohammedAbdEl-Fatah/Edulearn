import { Types } from "mongoose";
import { ISession } from "../../utils/interface";
import { CreateSessionDto, UpdateSessionDto } from "./session.dto";

export class SessionFactory {
      constructor() { }
      public createSession(data: CreateSessionDto, userID: string, courseID: string) {

            const session: Omit<ISession, "id"> = {
                  title: data.title,
                  courseId: new Types.ObjectId(courseID),
                  instructorId: new Types.ObjectId(userID),
                  videos: [],
                  pdfs: [],
                  createdAt: new Date(),
                  updatedAt: new Date()
            }
            return session;

      }
      public updateSession(oldData: ISession, data: UpdateSessionDto) {

            const session: Omit<ISession, "id"> = {
                  title: data.title || oldData.title,
                  courseId: oldData.courseId,
                  instructorId: oldData.instructorId,
                  videos: oldData.videos,
                  pdfs: oldData.pdfs,
                  createdAt: oldData.createdAt,
                  updatedAt: new Date()
            }
            return session;

      }
}

export default new SessionFactory();