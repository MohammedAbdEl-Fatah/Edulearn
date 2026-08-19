import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { env } from '../../config/env.local';

// Initialize Cloudinary once at startup
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME!,
    api_key: env.CLOUDINARY_API_KEY!,
    api_secret: env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryService {
    private static instance: CloudinaryService;
    private constructor() { }

    public static getInstance(): CloudinaryService {
        if (!CloudinaryService.instance) {
            CloudinaryService.instance = new CloudinaryService();
        }
        return CloudinaryService.instance;
    }

    // Upload single file (URL/Base64/FilePath)
    public uploadFile(file: string): Promise<UploadApiResponse> {
        return cloudinary.uploader.upload(file);
    }

    // Upload single buffer (Video)
    public uploadVideo(buffer: Buffer): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: 'videos',
                },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result);
                }
            );

            stream.end(buffer);
        });
    }

    // Upload multiple files concurrently
    public async uploadFiles(files: string[]) {
        return Promise.all(
            files.map(async (file) => {
                const result = await this.uploadFile(file);
                return {
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                };
            })
        );
    }

    // Upload multiple video buffers concurrently
    public async uploadVideos(files: Buffer[]) {
        return Promise.all(
            files.map(async (file) => {
                const result = await this.uploadVideo(file);
                return {
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                };
            })
        );
    }

    // Delete single file/video
    public deleteFile(public_id: string) {
        return cloudinary.uploader.destroy(public_id);
    }

    public deleteVideo(public_id: string) {
        return cloudinary.uploader.destroy(public_id, { resource_type: 'video' });
    }

    // Bulk deletion using Cloudinary Bulk API
    public deleteFiles(public_ids: string[]) {
        return cloudinary.api.delete_resources(public_ids);
    }

    public deleteVideos(public_ids: string[]) {
        return cloudinary.api.delete_resources(public_ids, { resource_type: 'video' });
    }
}