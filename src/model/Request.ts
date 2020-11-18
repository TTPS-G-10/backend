import { User } from "./User";
import { Request } from "express";
export interface CustomRequest extends Request {
    user: User
}