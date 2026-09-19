import { IFile } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { fileModel } from "./file.model";

export class FileRepository extends DatabaseRepository<IFile> {
    constructor() {
        super(fileModel);
    }
}