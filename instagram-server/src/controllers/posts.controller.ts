import { postModel, Post } from "../models/post";
import { Request, Response } from "express";
import {BaseController} from "./base.controller";

class PostsController extends BaseController<Post> {
    constructor() {
        super(postModel);
    }

    async getPagedPosts(req: Request, res: Response) {
        const filterByUploader = req.query.uploader;

        const skip = parseInt(req.body.skip) || 0;
        const limit = parseInt(req.body.limit) || 10

        try {
            if (filterByUploader) {
                const item = await this.model.find({ 'uploadedBy': filterByUploader }).skip(skip).limit(limit);
                res.send(item);
            }
            else {
                const items = await this.model.find().skip(skip).limit(limit);
                res.send(items);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    };

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