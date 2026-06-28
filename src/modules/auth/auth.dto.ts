export interface SignUpStudentDTO {
    fristName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword:string;
    dob:Date;
    phoneNumber:string;
}

export interface SignUpTeacherDTO {
    fristName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword:string;
    subjectCourse: string[];
    dob:Date;
    phoneNumber:string;
}
export interface ConfirmOtpDTO{
    email:string,
    otp:string
}

