import { IToken } from "../../utils/interface";
import { DatabaseRepository } from "../datebase.repository";
import { tokenModel } from "./token.model";

export class TokenRepository extends DatabaseRepository<IToken> {
    constructor() {
        super(tokenModel);
    }
}
 