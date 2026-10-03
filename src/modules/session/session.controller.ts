import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import sessionService from "./session.service";

export const sessionController = Router();

/**
 * @openapi
 * /session/create-session/{id}:
 *   post:
 *     summary: Create a new session for a course
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction to Node.js Basics"
 *     responses:
 *       200:
 *         description: Session created successfully
 *       400:
 *         description: Bad request (Session already exists)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
sessionController.post(
    "/create-session/:id",
    authMiddleware,
    sessionService.createSession
);

/**
 * @openapi
 * /session/update-session/{sessionID}/{id}:
 *   put:
 *     summary: Update an existing session
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionID
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Advanced Node.js Architecture"
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       400:
 *         description: Bad request (No changes, title exists, or modified within 5 minutes)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       404:
 *         description: Course or Session not found
 *       500:
 *         description: Internal server error
 */
sessionController.put(
    "/update-session/:sessionID/:id",
    authMiddleware,
    sessionService.updateSession
);

/**
 * @openapi
 * /session/get-all-sessions/{id}:
 *   get:
 *     summary: Get all sessions for a course
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Sessions fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
sessionController.get("/get-all-sessions/:id", authMiddleware, sessionService.getAllSessions);

/**
 * @openapi
 * /session/delete-session/{sessionID}/{id}:
 *   delete:
 *     summary: Delete a session
 *     tags: [Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionID
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       400:
 *         description: Bad request (Unable to delete session)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Teacher only)
 *       404:
 *         description: Course or Session not found
 *       500:
 *         description: Internal server error
 */
sessionController.delete("/delete-session/:sessionID/:id", authMiddleware, sessionService.deleteSession);