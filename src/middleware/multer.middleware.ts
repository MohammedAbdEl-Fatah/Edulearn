import multer from "multer";
import { AppError } from "../error/app.error";

export class MulterService {
    private static imageInstance: multer.Multer;
    private static videoInstance: multer.Multer;

    private constructor() { }

    private static file() {
        if (!this.imageInstance) {
            this.imageInstance = multer({
                storage: multer.memoryStorage(),
                limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
                fileFilter: (_req, file, cb) => {
                    const isImage = file.mimetype.startsWith('image/');
                    const isPdf = file.mimetype === 'application/pdf';

                    if (isImage || isPdf) {
                        cb(null, true);
                    } else {
                        cb(new AppError('Only images and PDFs are allowed'));
                    }
                },
            });
        }
        return this.imageInstance;
    }

    private static video() {
        if (!this.videoInstance) {
            this.videoInstance = multer({
                storage: multer.memoryStorage(),
                limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
                fileFilter: (_req, file, cb) => {
                    if (file.mimetype.startsWith('video/')) {
                        cb(null, true);
                    } else {
                        cb(new AppError('Only videos are allowed'));
                    }
                },
            });
        }
        return this.videoInstance;
    }

    public static singleImage(field: string) {
        return this.file().single(field);
    }

    public static arrayImage(field: string, maxCount?: number) {
        return this.file().array(field, maxCount);
    }

    public static fieldsImages(fields: { name: string; maxCount?: number }[]) {
        return this.file().fields(fields);
    }

    public static singleVideo(field: string) {
        return this.video().single(field);
    }

    public static arrayVideo(field: string, maxCount?: number) {
        return this.video().array(field, maxCount);
    }

    public static fieldsVideos(fields: { name: string; maxCount?: number }[]) {
        return this.video().fields(fields);
    }
}
export default MulterService;
