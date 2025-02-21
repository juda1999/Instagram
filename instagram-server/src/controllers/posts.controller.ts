import { postModel, Post } from "../models/post";
import { Request, Response } from "express";
import {BaseController} from "./base.controller";

class PostsController extends BaseController<Post> {
    constructor() {
        super(postModel);
    }

    async create(req: Request, res: Response) {
        const userId = req.params.userId;
        const post = {
            ...req.body,
            uploader: userId
        }
        req.body = post;
        super.addItem(req, res);
    };
}


export default new PostsController();