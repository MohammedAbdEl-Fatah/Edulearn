// verify token
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenRepository } from "../DB/token/token.repository";
import { UserRepository } from "../DB/user/user.repository";
import { RoleUSER } from "../utils/enum";
import { TokenSecret } from "../utils/generated";
import { IToken } from "../utils/interface";
import { AppError } from "../error/app.error";

export const verifyToken = (token: string, valueSecret: string): jwt.JwtPayload => {
    return jwt.verify(token, valueSecret) as jwt.JwtPayload;
};

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // NOTE: Express lowercases incoming header names
        const accessToken = req.headers["accesstoken"] as string | undefined;
        if (!accessToken) {
            return next(new AppError("Unauthorized", 401));
        }

        const [schemaAccessToken, accessTokenValue] = accessToken.split(" ");
        if (!schemaAccessToken || !accessTokenValue) {
            return next(new AppError("Unauthorized", 401));
        }
        if (
            schemaAccessToken !== RoleUSER.TEACHER &&
            schemaAccessToken !== RoleUSER.STUDENT
        ) {
            return next(new AppError("Unauthorized", 401));
        }

        let payloadAccess: jwt.JwtPayload & IToken;
        if (schemaAccessToken === RoleUSER.TEACHER) {
            payloadAccess = verifyToken(
                accessTokenValue,
                TokenSecret.secretUserTeacherAccessToken
            ) as jwt.JwtPayload & IToken;
        } else {
            payloadAccess = verifyToken(
                accessTokenValue,
                TokenSecret.secretUserStudentAccessToken
            ) as jwt.JwtPayload & IToken;
        }
        // jwt.verify already throws TokenExpiredError on expiry — no manual exp check needed

        const authorization = req.headers.authorization; // refresh token
        if (!authorization) {
            return next(new AppError("Unauthorized", 401));
        }

        const [schemaAuth, token] = authorization.split(" ");
        if (!schemaAuth || !token) {
            return next(new AppError("Unauthorized", 401));
        }
        if (
            schemaAuth !== RoleUSER.TEACHER &&
            schemaAuth !== RoleUSER.STUDENT
        ) {
            return next(new AppError("Unauthorized", 401));
        }

        let payloadUser: jwt.JwtPayload & IToken;
        if (schemaAuth === RoleUSER.TEACHER) {
            payloadUser = verifyToken(
                token,
                TokenSecret.secretUserTeacherRefreshToken
            ) as jwt.JwtPayload & IToken;
        } else {
            payloadUser = verifyToken(
                token,
                TokenSecret.secretUserStudentRefreshToken
            ) as jwt.JwtPayload & IToken;
        }

        // Cross-check: access token and refresh token must belong to the same role and the same user
        if (
            schemaAccessToken !== schemaAuth ||
            payloadAccess.userId !== payloadUser.userId
        ) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const tokenRepo = new TokenRepository();
        const userRepo = new UserRepository();

        const [tokenInDB, user] = await Promise.all([
            tokenRepo.getOne({ filter: { token, role: payloadUser.role } }),
            userRepo.getOne({ filter: { _id: payloadUser.userId } }),
        ]);

        if (!tokenInDB) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (tokenInDB.isRevoked) {
            return next(new AppError("Token revoked", 403));
        }
        if (tokenInDB.expires.getTime() < Date.now()) {
            return next(new AppError("Refresh token expired, you need login again", 403));
        }
        if (!user) {
            return next(new AppError("User not exist", 403));
        }

        req.user = user;
        return next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return next(new AppError("Token expired, you need login again", 403));
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid token🔴", 401));
        }
        return next(new AppError("Internal server error", 500));
    }
};