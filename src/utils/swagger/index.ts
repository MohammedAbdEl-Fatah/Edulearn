import swaggerJSDoc from "swagger-jsdoc";
import { env } from "../../config/env.local";

const port: number = parseInt(env.PORT || "8000");
const options: swaggerJSDoc.Options = {

    definition: {
        openapi: "3.0.0",
        info: {
            title: "Edulearn API",
            version: "1.0.0",
            description: "Edulearn API documentation",
        },
        servers: [
            {
                url: `http://localhost:${port}/api/v1`,
                description: "Development server",
            },
        ],

    },
    apis: ["./src/modules/**/*/*.controller.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 
