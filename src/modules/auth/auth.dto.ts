export interface SignUpStudentDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword:string;
    dob:Date;
    phone:string;
}

export interface SignUpTeacherDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword:string;
    subjectCourse: string[];
    dob:Date;
    phone:string;
}
export interface ConfirmOtpDTO{
    email:string,
    otp:string
}

export interface LoginDTO{
    email:string,
    password:string
}
export interface GeneratedOTPDTO{
    email:string;
}