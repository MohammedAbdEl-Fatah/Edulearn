/**
 * upload video 
 * download video
 * delete video
 * get video
 */

import { Router } from "express";
import MulterService from "../../middleware/multer.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";
import { RoleUSER } from "../../utils/enum";
import videoService from "./video.service";

export const videoController = Router();

videoController.post(
      "/upload/:id",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      MulterService.arrayVideo("videos", 10),
      videoService.uploadVideo
)
