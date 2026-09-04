import { Types } from "mongoose";



export interface CreateCourseDto {
    instructorId: Types.ObjectId;
    title: string;
    description: string;
    //price and discount
    price: number;
    discount: number;
    category: string;
}

export interface UpdateCourseDto {
    title?: string;
    description?: string;
    price?: number;
    discount?: number;
    category?: string;
}

