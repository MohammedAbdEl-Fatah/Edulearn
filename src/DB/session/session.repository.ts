import { ISession } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { sessionModel } from "./session.model";

export class SessionRepository extends DatabaseRepository<ISession> {
    constructor() {
        super(sessionModel);
    }
}