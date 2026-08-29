export interface IUser {
    readonly id: string;
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
    readonly id: string;
    instructorId: string;
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
    readonly id: string;
    userId: string;
    courseId: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISession {
    readonly id: string;
    courseId: string;
    title: string;
    videos:IVideo[];
    pdfs:IPdf[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IVideo {
    readonly id: string;
    sessionId: string;
    title: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPdf {
    readonly id: string;
    sessionId: string;
    title: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}
