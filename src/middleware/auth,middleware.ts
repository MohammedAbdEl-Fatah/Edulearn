// verify token
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenRepository } from "../DB/token/token.repository";
import { UserRepository } from "../DB/user/user.repository";
import { RoleUSER } from "../utils/enum";
import { TokenSecret } from "../utils/generated";
import { IToken } from "../utils/interface";

const verifyToken = (token: string, valueSecret: string): jwt.JwtPayload => {
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
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [schemaAccessToken, accessTokenValue] = accessToken.split(" ");
        if (!schemaAccessToken || !accessTokenValue) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (
            schemaAccessToken !== RoleUSER.TEACHER &&
            schemaAccessToken !== RoleUSER.STUDENT
        ) {
            return res.status(401).json({ message: "Unauthorized" });
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
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [schemaAuth, token] = authorization.split(" ");
        if (!schemaAuth || !token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (
            schemaAuth !== RoleUSER.TEACHER &&
            schemaAuth !== RoleUSER.STUDENT
        ) {
            return res.status(401).json({ message: "Unauthorized" });
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
        console.log("token", token);
        console.log("payloadUser.role", payloadUser.role);

        const [tokenInDB, user] = await Promise.all([
            tokenRepo.getOne({ filter: { token, role: payloadUser.role } }),
            userRepo.getOne({ filter: { _id: payloadUser.userId } }),
        ]);
        console.log(tokenInDB);

        if (!tokenInDB) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (tokenInDB.isRevoked) {
            return res.status(403).json({ message: "Token revoked" });
        }
        if (tokenInDB.expires.getTime() < Date.now()) {
            return res
                .status(403)
                .json({ message: "Refresh token expired, you need login again" });
        }
        if (!user) {
            return res.status(403).json({ message: "User not exist" });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ message: "Token expired, you need login again" });
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token🔴" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};