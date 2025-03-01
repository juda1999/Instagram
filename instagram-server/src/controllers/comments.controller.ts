import { commentModel, Comment } from "../models/comment";
import {BaseController} from "./base.controller";
import { Request, Response } from "express";


class CommentsController extends BaseController<Comment> {
    constructor() {
      super(commentModel);
    }

    async getItemsByPostId(req: Request, res: Response) {
        const postId = req.params.postId;
        try {
            const items = await this.model.find({ 'post': postId });
            res.send(items);
        } catch (error) {
            res.status(400).send(error);
        }
    }
  }

export const commentsController = new CommentsController()


