import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Edulearn API",
            version: "1.0.0",
            description: "Edulearn E-Learning Platform API documentation",
        },
        servers: [
            {
                url: `https://edulearn-gray.vercel.app/api/v1`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
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
    },
    apis: ["./src/modules/**/*.controller.ts", "./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 
