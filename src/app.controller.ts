import type { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDatabase } from "./DB/connect.database";


//import modules 
import authController from "./modules/auth/auth.controller";
import { userController } from "./modules/user/user.controller";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
});
const port: number = parseInt(process.env.PORT || "3000", 10);
export const bootstrap = async (app: Express, express: any): Promise<void> => {



    await connectDatabase();
    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded when using form data
    // security headers, rate limiting, cors
    app.use(cors({
        origin: /*process.env.CORS_ORIGIN*/ "*", // TODO: uncomment this line and comment the next line
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
        limiter,
        helmet());



    // All Modules
    app.use("/api/v1/auth", authController);
    app.use("/api/v1/user", userController);
    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`);
    });
};