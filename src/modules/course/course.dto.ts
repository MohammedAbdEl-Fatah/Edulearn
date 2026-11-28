import { CategoryType } from "../../utils/enum";

export interface CreateCourseDto {
    title: string;
    description: string;
    price: number;
    discount?: number;
    discountStartDate?: Date | string;
    discountEndDate?: Date | string;
    category: CategoryType;
}

export interface editCourseDto {
    title?: string;
    description?: string;
    price?: number;
    discount?: number;
    discountStartDate?: Date | string;
    discountEndDate?: Date | string;
    discountFrom?: Date | string;
    discountTo?: Date | string;
    thumbnail?: {
        url: string;
        publicId: string;
    };
}

