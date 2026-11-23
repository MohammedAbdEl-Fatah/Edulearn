import { Request, Response } from "express";
import { CourseRepository } from "../../DB/course/course.repository";
import { EnrollmentRepository } from "../../DB/enrollment/enrollment.repository";
import { UserRepository } from "../../DB/user/user.repository";
import { AppError } from "../../error/app.error";
import { asyncHandleError } from "../../error/async.handle";
import { encryptValue } from "../../utils/encrypt";
import { RoleUSER } from "../../utils/enum";
import UserResponse, { IUserStats } from "./user.response";

class UserService {
    constructor(
        private readonly userResponse: UserResponse,
        private readonly userRepository: UserRepository,
        private readonly courseRepository: CourseRepository,
        private readonly enrollmentRepository: EnrollmentRepository,
    ) { }

    public getInformationUser = asyncHandleError(
        async (req: Request, res: Response) => {
            const user = req.user!;
            let stats: IUserStats = {};

            if (user.role === RoleUSER.TEACHER) {
                const coursesCount = await this.courseRepository.count({
                    instructorId: user.id,
                });
                stats = { coursesCount };
            } else if (user.role === RoleUSER.STUDENT) {
                const enrollments = await this.enrollmentRepository.getAll({
                    filter: { studentId: user.id },
                });
                const coursesCount = enrollments.length;
                const completedLessonsCount = enrollments.reduce(
                    (total, enrollment) => total + (enrollment.completedLessons?.length || 0),
                    0
                );
                stats = { coursesCount, completedLessonsCount };
            }

            const responseInfoUser = this.userResponse.InfoUser(user, stats);
            return res.status(200).json({ message: "Information user", data: responseInfoUser });
        }
    );

    public editProfile = asyncHandleError(
        async (req: Request, res: Response) => {
            const userId = req.user!.id;
            const { firstName, lastName, about ,phone} = req.body;

            const updateData: Record<string, any> = {};
            if (firstName !== undefined) updateData.firstName = firstName;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (about !== undefined) updateData.about = about;
            if (phone !== undefined) updateData.phone = encryptValue(phone);

            await this.userRepository.updateOne({
                filter: { _id: userId },
                projection: { $set: updateData },
            });

            const updatedUser = await this.userRepository.getOne({
                filter: { _id: userId },
            });

            if (!updatedUser) {
                throw new AppError("User not found", 404);
            }

            // Keep in-memory req.user in sync if needed
            req.user = updatedUser;

            const response = this.userResponse.InfoUser(updatedUser);
            return res.status(200).json({ message: "Profile updated successfully", data: response });
        }
    );
}

export default new UserService(
    new UserResponse(),
    new UserRepository(),
    new CourseRepository(),
    new EnrollmentRepository(),
);
