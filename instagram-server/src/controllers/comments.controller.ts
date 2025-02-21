import { commentModel, Comment } from "../models/comment";
import {BaseController} from "./base.controller";

export const commentsController = new BaseController<Comment>(commentModel);


