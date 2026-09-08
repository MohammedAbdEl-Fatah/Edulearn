import { CategoryType } from "../../utils/enum";

export interface CreateCourseDto {
    title: string;
    description: string;
    price: number;
    discount: number;
    category: CategoryType;
}

export interface editCourseDto {
    title?: string;
    description?: string;
    //only discount can be change 
    discount?: number;
}

