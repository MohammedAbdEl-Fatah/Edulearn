import swaggerJSDoc from "swagger-jsdoc";
import { env } from "../../config/env.local";

const port = env.PORT || "8000";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Edulearn API",
            version: "2.0.0",
            description: "Edulearn E-Learning Platform API documentation (Course module updated to v2)",
        },
        servers: [
            {
                url: `http://localhost:${port}/api/v1`,
                description: "Local Server (v1 - Auth, User, Session, Video, File, Enrollment)",
            },
            {
                url: `http://localhost:${port}/api/v2`,
                description: "Local Server (v2 - Course)",
            },
            {
                url: `https://edulearn-gray.vercel.app/api/v1`,
                description: "Production Server (v1 - Auth, User, Session, Video, File, Enrollment)",
            },
            {
                url: `https://edulearn-gray.vercel.app/api/v2`,
                description: "Production Server (v2 - Course)",
            },
        ],
        tags: [
            {
                name: "Authentication",
                description: "Authentication and authorization operations",
            },
            {
                name: "User",
                description: "User profile and account operations",
            },
            {
                name: "Course",
                description: "Course management operations (API v2)",
            },
            {
                name: "Session",
                description: "Session and lecture management operations",
            },
            {
                name: "Video",
                description: "Video upload, streaming, and playlist operations",
            },
            {
                name: "File",
                description: "File and assignment submission & grading operations",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT access token from /auth/login. You can paste the raw token directly, or prefix with 'Bearer ', 'teacher ', or 'student '.",
                },
                accessToken: {
                    type: "apiKey",
                    in: "header",
                    name: "accesstoken",
                    description: "Access token header. Format: 'teacher <token>', 'student <token>', or '<token>'",
                },
                authorizationHeader: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                    description: "Authorization header (refresh token or access token). Format: 'teacher <token>', 'student <token>', 'Bearer <token>', or '<token>'",
                },
            },
            schemas: {
                RegisterStudent: {
                    type: "object",
                    required: ["firstName", "lastName", "email", "password", "confirmPassword", "dob"],
                    properties: {
                        firstName: { type: "string", example: "John" },
                        lastName: { type: "string", example: "Doe" },
                        email: { type: "string", format: "email", example: "student@example.com" },
                        password: { type: "string", format: "password", example: "123456" },
                        confirmPassword: { type: "string", format: "password", example: "123456" },
                        dob: { type: "string", format: "date", example: "2000-01-01" },
                        phone: { type: "string", example: "+1234567890" },
                    },
                },
                RegisterTeacher: {
                    type: "object",
                    required: ["firstName", "lastName", "email", "password", "confirmPassword", "dob"],
                    properties: {
                        firstName: { type: "string", example: "Jane" },
                        lastName: { type: "string", example: "Smith" },
                        email: { type: "string", format: "email", example: "teacher@example.com" },
                        password: { type: "string", format: "password", example: "123456" },
                        confirmPassword: { type: "string", format: "password", example: "123456" },
                        dob: { type: "string", format: "date", example: "1990-05-15" },
                        phone: { type: "string", example: "+1234567890" },
                    },
                },
                VerifyEmail: {
                    type: "object",
                    required: ["email", "otp"],
                    properties: {
                        email: { type: "string", format: "email", example: "user@example.com" },
                        otp: { type: "string", example: "123456" },
                    },
                },
                GenerateOtp: {
                    type: "object",
                    required: ["email"],
                    properties: {
                        email: { type: "string", format: "email", example: "user@example.com" },
                    },
                },
                ForgetPassword: {
                    type: "object",
                    required: ["email", "otp", "newPassword"],
                    properties: {
                        email: { type: "string", format: "email", example: "user@example.com" },
                        otp: { type: "string", example: "123456" },
                        newPassword: { type: "string", format: "password", example: "newpassword123" },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/modules/auth/**/*.ts",
        "./src/modules/user/**/*.ts",
        "./src/modules/course/**/*.ts",
        "./src/modules/session/**/*.ts",
        "./src/modules/video/**/*.ts",
        "./src/modules/file/**/*.ts",
        "./src/modules/**/*.ts",
    ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 
