import { Router } from "express";
import MulterService from "../../middleware/multer.middleware";
import fileService from "./file.service";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";
import { RoleUSER } from "../../utils/enum";
const fileController = Router()
fileController.post("/upload/:id", authMiddleware, allowRoles(RoleUSER.TEACHER),
      MulterService.singleFile("file"), fileService.createFile);
export default fileController;