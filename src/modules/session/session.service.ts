import { NextFunction, Request, Response } from "express";
import { CourseRepository } from "../../DB/course/course.repository";
import { SessionRepository } from "../../DB/session/session.repository";
import { AppError } from "../../error/app.error";
import { asyncHandleError } from "../../error/async.handle";
import { RoleUSER } from "../../utils/enum";
import { CreateSessionDto, UpdateSessionDto } from "./session.dto";
import { SessionFactory } from "./session.factory";
import SessionResponse from "./session.reponse";
import { updateSessionParamsSchema, updateSessionSchema } from "./session.validation";
/**
 * TODO : how get session for student or anther teacher?
 * 
 */


class SessionService {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly courseRepository: CourseRepository,
        private readonly sessionResponse: SessionResponse,
        private readonly factory: SessionFactory,
    ) { }
    //create session
    public createSession = asyncHandleError(
        async (req: Request, res: Response, next: NextFunction) => {
            //check role of user 
            this.checkRoleUser(req.user);
            //check course user id 
            const courseDB = await this.courseRepository.getOne({
                filter: { _id: req.params.id, instructorId: req.user?.id }
            });
            if (!courseDB) {
                throw new AppError("Course not found", 404);
            }
            // checkSession not same name title
            const sessionDB = await this.sessionRepository.getOne({
                filter: { title: req.body.title, courseId: courseDB.id, instructorId: req.user?.id }
            });
            if (sessionDB) {
                throw new AppError("Session already exists", 400);
            }
            //get data
            const createSessionDto: CreateSessionDto = req.body;
            //factory
            const session = this.factory.createSession(createSessionDto, req.user!.id.toString(), req.params.id as string);
            //save session in db
            const sessionData = await this.sessionRepository.create(session);


            //response 
            return res.status(200).json(this.sessionResponse.createSessionResponse(sessionData));

        }
    );
    //update session 
    public updateSession = asyncHandleError(
        async (req: Request, res: Response) => {

            // 1. Authorization
            this.checkRoleUser(req.user);

            // 2. Validate params
            const { id: courseID, sessionID } =
                updateSessionParamsSchema.parse(req.params);

            // 3. Get user
            const userID = req.user!.id;

            // 4. Validate body
            const updateSessionDto: UpdateSessionDto =
                updateSessionSchema.parse(req.body);

            // 5. Check course ownership
            const courseDB = await this.courseRepository.getOne({
                filter: {
                    _id: courseID,
                    instructorId: userID
                }
            });

            if (!courseDB) {
                throw new AppError("Course not found", 404);
            }

            // 6. Check session ownership
            const sessionDB = await this.sessionRepository.getOne({
                filter: {
                    _id: sessionID,
                    courseId: courseID,
                    instructorId: userID
                }
            });

            if (!sessionDB) {
                throw new AppError("Session not found", 404);
            }

            // 7. Prevent frequent updates
            const FIVE_MINUTES = 5 * 60 * 1000;

            if (
                Date.now() - sessionDB.updatedAt.getTime()
                < FIVE_MINUTES
            ) {
                throw new AppError(
                    "You cannot update the session again within 5 minutes",
                    400
                );
            }

            // 8. Check actual changes
            const hasChanges =
                updateSessionDto.title !== undefined &&
                updateSessionDto.title !== sessionDB.title;

            if (!hasChanges) {
                throw new AppError(
                    "No changes to update",
                    400
                );
            }

            // 9. Check duplicate title
            if (updateSessionDto.title) {

                const existingSession =
                    await this.sessionRepository.getOne({
                        filter: {
                            title: updateSessionDto.title,
                            courseId: courseID,
                            instructorId: userID,
                            _id: { $ne: sessionID }
                        }
                    });

                if (existingSession) {
                    throw new AppError(
                        "Session title already exists",
                        400
                    );
                }
            }

            // 10. Factory
            const session = this.factory.updateSession(
                sessionDB,
                updateSessionDto
            );

            // 11. Update
            const result =
                await this.sessionRepository.updateOne({
                    filter: {
                        _id: sessionID,
                        courseId: courseID,
                        instructorId: userID
                    },
                    projection: {
                        $set: session
                    }
                });

            if (!result.matchedCount) {
                throw new AppError(
                    "Unable to update session",
                    400
                );
            }

            // 12. Response
            return res.status(200).json(
                this.sessionResponse.updateSessionResponse(
                    sessionID,
                    session
                )
            );
        }
    );
    //get all sessions
    public getAllSessions = asyncHandleError(
        async (req: Request, res: Response) => {

            // 1. Check role
            this.checkRoleUser(req.user);

            // 2. Get params
            const courseID = req.params.id as string;

            // 3. Get user ID
            const userID = req.user!.id;

            // 4. Check course ownership
            const courseDB = await this.courseRepository.getOne({
                filter: {
                    _id: courseID,
                    instructorId: userID
                }
            });

            if (!courseDB) {
                throw new AppError("Course not found", 404);
            }

            // 5. Get all sessions
            const sessionsDB = await this.sessionRepository.getAll({
                filter: {
                    courseId: courseID,
                    instructorId: userID
                }
            });

            // 6. Response
            return res.status(200).json(
                this.sessionResponse.getAllSessionsResponse(sessionsDB)
            );
        }
    );
    //delete session
    public deleteSession = asyncHandleError(
        async (req: Request, res: Response) => {

            // 1. Check role
            this.checkRoleUser(req.user);

            // 2. Get params
            const courseID = req.params.id as string;
            const sessionID = req.params.sessionID as string;

            // 3. Get user ID
            const userID = req.user!.id;

            // 4. Check course ownership
            const courseDB = await this.courseRepository.getOne({
                filter: {
                    _id: courseID,
                    instructorId: userID
                }
            });

            if (!courseDB) {
                throw new AppError("Course not found", 404);
            }

            // 5. Check session ownership
            const sessionDB = await this.sessionRepository.getOne({
                filter: {
                    _id: sessionID,
                    courseId: courseID,
                    instructorId: userID
                }
            });

            if (!sessionDB) {
                throw new AppError("Session not found", 404);
            }

            // 6. Delete session
            const deleteSessionData =
                await this.sessionRepository.deleteOne({
                    filter: {
                        _id: sessionID,
                        courseId: courseID,
                        instructorId: userID
                    }
                });

            if (!deleteSessionData.deletedCount) {
                throw new AppError(
                    "Unable to delete session",
                    400
                );
            }

            // 7. Response
            return res.status(200).json(
                this.sessionResponse.deleteSessionResponse(sessionID)
            );
        }
    );


    //! private
    private checkRoleUser = (user: any) => {
        if (user?.role !== RoleUSER.TEACHER) {
            throw new AppError("forbidden you dont have permission to create course", 403);
        }
    }

}

export default new SessionService(new SessionRepository, new CourseRepository, new SessionResponse(), new SessionFactory());