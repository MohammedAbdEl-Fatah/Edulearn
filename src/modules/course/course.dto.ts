import { CategoryType } from "../../utils/enum";

export interface CreateCourseDto {
    title: string;
    description: string;
    //price and discount
    price: number;
    discount: number;
    category: CategoryType;
}

export interface UpdateCourseDto {
    title?: string;
    description?: string;
    price?: number;
    discount?: number;
    category?: CategoryType;
}

