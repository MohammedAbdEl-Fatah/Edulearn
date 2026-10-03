import { Router } from "express";
import MulterService from "../../middleware/multer.middleware";
import fileService from "./file.service";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";
import { RoleUSER } from "../../utils/enum";
import fileValidation from "./file.validation";
import { isValidationBody } from "../../middleware/validation.middleware";
const fileController = Router()
fileController.post("/upload/:id", authMiddleware, allowRoles(RoleUSER.TEACHER),
      MulterService.singleFile("file"), fileService.createFile);
fileController.post("/submit-assignment/:id/:idAssenment", authMiddleware, allowRoles(RoleUSER.STUDENT),
      MulterService.singleFile("file"), fileService.submitAssenment);
fileController.patch("/result/:id", isValidationBody(fileValidation.resultAssenment), authMiddleware, allowRoles(RoleUSER.TEACHER), fileService.correstAsssignment);
fileController.put("/replace/:id",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      MulterService.singleFile("file"),
      fileService.replaceFile);

fileController.delete("/delete/:id",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      fileService.deleteFile);

fileController.get("/get-correst/:id", authMiddleware, allowRoles(RoleUSER.STUDENT), fileService.getCorrestFile);
fileController.get("/get-all-submit-assignment/:id", authMiddleware, allowRoles(RoleUSER.TEACHER), fileService.getAllsubmitAssignment);
fileController.get("/get-files-session/:teacherId/:id", authMiddleware, allowRoles(RoleUSER.STUDENT, RoleUSER.TEACHER), fileService.getAllfilesSession);
export default fileController;