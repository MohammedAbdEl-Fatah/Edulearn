import { Types } from "mongoose";

export interface IUser {
    readonly id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    dob: Date;
    phone: string;
    isVerified: boolean;
    otp: string;
    otpExpires: Date;
    createdAt: Date;
    updatedAt: Date;
    subjectCourse?: string[];
}
export interface IToken {
    readonly id: string;
    userId: string;
    role: string;
    token: string;
    expires: Date;
    isRevoked: boolean;
}
export interface ICourse {
    readonly id: Types.ObjectId;
    instructorId: Types.ObjectId;
    title: string;
    description: string;
    //price and discount
    price: number;
    discount: number;
    sessions: ISession[];
    // duration: number;
    category: string;
    reviews: IReview[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IReview {
    readonly id: Types.ObjectId;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISession {
    readonly id: Types.ObjectId;
    courseId: Types.ObjectId;
    instructorId: Types.ObjectId;
    title: string;
    videos: IVideo[];
    pdfs: IPdf[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IVideo {
    readonly id: Types.ObjectId;
    sessionId: Types.ObjectId;
    title: string;
    url: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPdf {
    readonly id: Types.ObjectId;
    sessionId: Types.ObjectId;
    title: string;
    url: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
