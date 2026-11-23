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

// Helper to extract role and raw token from any header format (role prefix, Bearer prefix, or raw token)
export const parseTokenHeader = (headerValue: string | undefined): { role?: RoleUSER | undefined; token: string } | null => {
    if (!headerValue || typeof headerValue !== "string") return null;
    const trimmed = headerValue.trim();
    if (!trimmed) return null;

    const parts = trimmed.split(/\s+/);
    let prefix: string | undefined;
    let token: string = "";

    if (parts.length === 1 && parts[0]) {
        token = parts[0];
    } else if (parts.length > 1 && parts[1]) {
        prefix = parts[0];
        token = parts[1];
    }

    if (!token) return null;

    let role: RoleUSER | undefined;
    if (prefix === RoleUSER.TEACHER || prefix === RoleUSER.STUDENT) {
        role = prefix as RoleUSER;
    } else {
        try {
            const decoded = jwt.decode(token) as jwt.JwtPayload | null;
            if (decoded && (decoded.role === RoleUSER.TEACHER || decoded.role === RoleUSER.STUDENT)) {
                role = decoded.role as RoleUSER;
            }
        } catch {
            // ignore
        }
    }

    return { role, token };
};

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const rawAccessToken = req.headers["accesstoken"] as string | undefined;
        const rawAuthorization = req.headers.authorization;

        const parsedAccess = parseTokenHeader(rawAccessToken);
        const parsedAuth = parseTokenHeader(rawAuthorization);

        if (!parsedAccess && !parsedAuth) {
            return next(new AppError("Unauthorized - No token provided", 401));
        }

        const tokenRepo = new TokenRepository();
        const userRepo = new UserRepository();

        // Dual token flow (when both accesstoken and authorization headers are supplied)
        if (parsedAccess && parsedAuth) {
            const accessRole = parsedAccess.role;
            const authRole = parsedAuth.role;

            if (!accessRole || !authRole || accessRole !== authRole) {
                return next(new AppError("Unauthorized - Invalid token role", 401));
            }

            const accessSecret = accessRole === RoleUSER.TEACHER
                ? TokenSecret.secretUserTeacherAccessToken
                : TokenSecret.secretUserStudentAccessToken;

            const refreshSecret = authRole === RoleUSER.TEACHER
                ? TokenSecret.secretUserTeacherRefreshToken
                : TokenSecret.secretUserStudentRefreshToken;

            const payloadAccess = verifyToken(parsedAccess.token, accessSecret) as jwt.JwtPayload & IToken;
            const payloadUser = verifyToken(parsedAuth.token, refreshSecret) as jwt.JwtPayload & IToken;

            if (payloadAccess.userId !== payloadUser.userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const [tokenInDB, user] = await Promise.all([
                tokenRepo.getOne({ filter: { token: parsedAuth.token, role: payloadUser.role } }),
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
        }

        // Single token flow (when a single token is supplied, e.g. Bearer token in Swagger)
        const single = parsedAccess || parsedAuth!;
        const role = single.role;

        if (!role) {
            return next(new AppError("Unauthorized - Invalid token format or missing role", 401));
        }

        let payload: (jwt.JwtPayload & IToken) | null = null;
        const accessSecret = role === RoleUSER.TEACHER
            ? TokenSecret.secretUserTeacherAccessToken
            : TokenSecret.secretUserStudentAccessToken;

        try {
            payload = verifyToken(single.token, accessSecret) as jwt.JwtPayload & IToken;
        } catch (accessErr) {
            if (accessErr instanceof jwt.TokenExpiredError) {
                return next(new AppError("Token expired, you need login again", 403));
            }
            // If access token verification fails, attempt verifying as refresh token
            const refreshSecret = role === RoleUSER.TEACHER
                ? TokenSecret.secretUserTeacherRefreshToken
                : TokenSecret.secretUserStudentRefreshToken;
            try {
                payload = verifyToken(single.token, refreshSecret) as jwt.JwtPayload & IToken;
            } catch {
                throw accessErr;
            }
        }

        if (!payload || !payload.userId) {
            return next(new AppError("Unauthorized - Invalid token payload", 401));
        }

        const user = await userRepo.getOne({ filter: { _id: payload.userId } });
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
        if (err instanceof AppError) {
            return next(err);
        }
        return next(new AppError("Internal server error", 500));
    }
};