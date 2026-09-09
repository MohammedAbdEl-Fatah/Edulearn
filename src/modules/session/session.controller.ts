import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import sessionService from "./session.service";

export const sessionController = Router();

sessionController.post(
    "/create-session/:id",
    authMiddleware,
    sessionService.createSession
)

//url => update-session/:sessionID/:id
sessionController.put(
    "/update-session/:sessionID/:id",
    authMiddleware,
    sessionService.updateSession
)
sessionController.get("/get-all-sessions/:id", authMiddleware, sessionService.getAllSessions)
//url => delete-session/:sessionID/:id
sessionController.delete("/delete-session/:sessionID/:id", authMiddleware, sessionService.deleteSession)