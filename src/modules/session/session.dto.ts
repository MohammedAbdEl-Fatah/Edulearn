import { Types } from "mongoose";

export interface CreateSessionDto {
    courseId: Types.ObjectId;//url
    title: string;
}
export interface UpdateSessionDto {
    title?: string;
}   