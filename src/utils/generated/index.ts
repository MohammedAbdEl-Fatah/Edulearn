import jwt from "jsonwebtoken";
import ms from "ms";
import { env } from "../../config/env.local";
import { RoleUSER, TokenType } from "../enum";

// generate otp
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();// like 000000 6digit
}
export const generateOtpExpire = (time: number = 5) => {
    return new Date(Date.now() + time * 60 * 1000);//like time =10; => 10 minutes default 5 minites
}
// generate Token: access and refresh token for student and teacher
export const TokenSecret = {
    secretUserStudentAccessToken: env.SECRET_TOKEN_ACCESS_STUDENT!,
    secretUserTeacherAccessToken: env.SECRET_TOKEN_ACCESS_TEACHER!,
    secretUserStudentRefreshToken: env.SECRET_TOKEN_REFRESH_STUDENT!,
    secretUserTeacherRefreshToken: env.SECRET_TOKEN_REFRESH_TEACHER!,
}


export const generatedToken = ({ data, roleSecret, time, tokenType }:
    { data: any, roleSecret: string, time: number | ms.StringValue, tokenType: string }) => {
    if (roleSecret === RoleUSER.STUDENT) {
        if (tokenType === TokenType.ACCESS) {
            return jwt.sign(data, TokenSecret.secretUserStudentAccessToken, { expiresIn: time = '30m' });
        }
        return jwt.sign(data, TokenSecret.secretUserStudentRefreshToken, { expiresIn: time = '7d' });
    }

    if (roleSecret === RoleUSER.TEACHER) {
        if (tokenType === TokenType.ACCESS) {
            return jwt.sign(data, TokenSecret.secretUserTeacherAccessToken, { expiresIn: time = '30m' });
        }
        return jwt.sign(data, TokenSecret.secretUserTeacherRefreshToken, { expiresIn: time = '7d' });
    }

    throw new Error('Invalid role');
};