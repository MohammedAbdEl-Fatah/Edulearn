import { Router } from "express";
import MulterService from "../../middleware/multer.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";
import { RoleUSER } from "../../utils/enum";
import videoService from "./video.service";

export const videoController = Router();

/**
 * @openapi
 * /video/upload/{id}:
 *   post:
 *     summary: Upload video files for a course session
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - videos
 *             properties:
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 10 video files to upload
 *     responses:
 *       201:
 *         description: Videos uploaded successfully
 *       400:
 *         description: Bad request (No videos provided or invalid format)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher role required)
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
videoController.post(
      "/upload/:id",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      MulterService.arrayVideo("videos", 10),
      videoService.uploadVideo
);

/**
 * @openapi
 * /video/delete-video/{id}/{idvideo}:
 *   delete:
 *     summary: Delete a specific video from a session
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *       - in: path
 *         name: idvideo
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       400:
 *         description: Bad request (Missing ID)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher role required)
 *       404:
 *         description: Session or Video not found
 *       500:
 *         description: Internal server error
 */
videoController.delete(
      "/delete-video/:id/:idvideo",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      videoService.deleteVideo
);

/**
 * @openapi
 * /video/get-all-video/{id}:
 *   get:
 *     summary: Get all videos for a course session
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Videos fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher role required)
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
videoController.get(
      "/get-all-video/:id",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      videoService.getAllVideo
);

/**
 * @openapi
 * /video/get-video/{id}/{idvideo}:
 *   get:
 *     summary: Get details of a single video in a session
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *       - in: path
 *         name: idvideo
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher role required)
 *       404:
 *         description: Video not found
 *       500:
 *         description: Internal server error
 */
videoController.get(
      "/get-video/:id/:idvideo",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      videoService.getOneVideo
);

/**
 * @openapi
 * /video/{id}/reorder:
 *   patch:
 *     summary: Reorder videos in a course session
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videos
 *             properties:
 *               videos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - order
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "650000000000000000000001"
 *                     order:
 *                       type: number
 *                       example: 0
 *     responses:
 *       200:
 *         description: Videos reordered successfully
 *       400:
 *         description: Bad request (Invalid order or array format)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher role required)
 *       404:
 *         description: Session or Video not found
 *       500:
 *         description: Internal server error
 */
videoController.patch(
      "/:id/reorder",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      videoService.reorderVideos
);