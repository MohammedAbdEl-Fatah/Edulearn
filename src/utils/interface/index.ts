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
    createdAt: Date;
    updatedAt: Date;
}