import { ISession } from "../../utils/interface";

class SessionResponse {
    createSessionResponse(data: ISession) {
        return {
            status: "success",
            message: "Session Created Successfully",
            data: {
                id: data.id,
                courseId: data.courseId,
                instructorId: data.instructorId,
                title: data.title,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }
        }

    }
    updateSessionResponse(id: string, data: Omit<ISession, "id"> | ISession) {
        return {
            status: "success",
            message: "Session Updated Successfully",
            data: {
                id,
                courseId: data.courseId,
                instructorId: data.instructorId,
                title: data.title,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            }
        }

    }
    getAllSessionsResponse(sessions: ISession[]) {
        return {
            status: "success",
            message: "Sessions Fetched Successfully",
            count: sessions.length,
            data: sessions
        }
    }
    deleteSessionResponse(id: string) {
        return {
            status: "success",
            message: "Session Deleted Successfully",
            data: {
                id
            }
        }
    }


}
export default SessionResponse;