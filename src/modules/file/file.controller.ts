import { Router } from "express";
import MulterService from "../../middleware/multer.middleware";
import fileService from "./file.service";
import { authMiddleware } from "../../middleware/auth.middleware";
import { allowRoles } from "../../middleware/role.middleware";
import { RoleUSER } from "../../utils/enum";
import fileValidation from "./file.validation";
import { isValidationBody } from "../../middleware/validation.middleware";
const fileController = Router();

/**
 * @openapi
 * /file/upload/{id}:
 *   post:
 *     summary: Upload a file/assignment for a session
 *     tags: [File]
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
 *               - file
 *               - typeAssenment
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               typeAssenment:
 *                 type: string
 *                 enum: [view, quiz, assignment, answerAssignment, corrected]
 *                 description: Type of file or assignment
 *     responses:
 *       201:
 *         description: File created successfully
 *       400:
 *         description: Bad request (Missing or invalid parameters/file)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       500:
 *         description: Internal server error
 */
fileController.post("/upload/:id", authMiddleware, allowRoles(RoleUSER.TEACHER),
      MulterService.singleFile("file"), fileService.createFile);

/**
 * @openapi
 * /file/submit-assignment/{id}/{idAssenment}:
 *   post:
 *     summary: Submit an assignment answer file
 *     tags: [File]
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
 *         name: idAssenment
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment File ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Assignment answer file to upload
 *     responses:
 *       201:
 *         description: File created successfully
 *       400:
 *         description: Bad request (Missing file or invalid parameters)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Student only)
 *       500:
 *         description: Internal server error
 */
fileController.post("/submit-assignment/:id/:idAssenment", authMiddleware, allowRoles(RoleUSER.STUDENT),
      MulterService.singleFile("file"), fileService.submitAssenment);

/**
 * @openapi
 * /file/result/{id}:
 *   patch:
 *     summary: Correct assignment submission and assign grade/feedback
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Submitted Student File ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - grade
 *             properties:
 *               grade:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 90
 *               feedback:
 *                 type: string
 *                 example: Well written assignment.
 *     responses:
 *       200:
 *         description: File corrected successfully
 *       400:
 *         description: Bad request (Validation error)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
fileController.patch("/result/:id", isValidationBody(fileValidation.resultAssenment), authMiddleware, allowRoles(RoleUSER.TEACHER), fileService.correstAsssignment);

/**
 * @openapi
 * /file/replace/{id}:
 *   put:
 *     summary: Replace an existing file
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID to replace
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Replacement file
 *     responses:
 *       200:
 *         description: File replaced successfully
 *       400:
 *         description: Bad request (File required or file already exists)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
fileController.put("/replace/:id",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      MulterService.singleFile("file"),
      fileService.replaceFile);

/**
 * @openapi
 * /file/delete/{id}:
 *   delete:
 *     summary: Delete a file by ID
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       400:
 *         description: Bad request (ID required)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
fileController.delete("/delete/:id",
      authMiddleware,
      allowRoles(RoleUSER.TEACHER),
      fileService.deleteFile);

/**
 * @openapi
 * /file/get-correst/{id}:
 *   get:
 *     summary: Get corrected assignment result for a student
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File fetched successfully
 *       400:
 *         description: Bad request (ID required)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Student only)
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
fileController.get("/get-correst/:id", authMiddleware, allowRoles(RoleUSER.STUDENT), fileService.getCorrestFile);

/**
 * @openapi
 * /file/get-all-submit-assignment/{id}:
 *   get:
 *     summary: Get all submitted student assignments for a specific assignment file
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment File ID
 *     responses:
 *       200:
 *         description: Files fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       404:
 *         description: Files not found
 *       500:
 *         description: Internal server error
 */
fileController.get("/get-all-submit-assignment/:id", authMiddleware, allowRoles(RoleUSER.TEACHER), fileService.getAllsubmitAssignment);

/**
 * @openapi
 * /file/get-files-session/{teacherId}/{id}:
 *   get:
 *     summary: Get all files for a session of a teacher
 *     tags: [File]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Files fetched successfully
 *       400:
 *         description: Bad request (Session required)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Files not found
 *       500:
 *         description: Internal server error
 */
fileController.get("/get-files-session/:teacherId/:id", authMiddleware, allowRoles(RoleUSER.STUDENT, RoleUSER.TEACHER), fileService.getAllfilesSession);

export default fileController;