const { fileTypeFromBuffer } = require("file-type");
import fs from "fs";

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = async (req: any, res: any, next: any) => {
    try {
        // get the file path
        const filePath = req.file.path;
        // read the file and return buffer
        const buffer = fs.readFileSync(filePath);
        // get the file type
        const type = await fileTypeFromBuffer(buffer);
        // validate
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!type || !allowedTypes.includes(type.mime))
            return next(new Error("Invalid file type"));

        return next();
    } catch (error) {
        return next(new Error("Internal server error"));
    }
};