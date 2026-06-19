import type { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
});

export const bootstrap = (app: Express, express: any): void => {
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
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
};