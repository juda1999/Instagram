import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<T> {
    model: Model<T>;
    constructor(model: any) {
        this.model = model;
    }

    async getAllItems(req: Request, res: Response) {
        const filterByPostId = req.query.postId;
        const filterByUploader = req.query.uploader;
        try {
            if (filterByPostId) {
                const item = await this.model.find({ 'post': filterByPostId });
                res.send(item);
            }
            if (filterByUploader) {
                const item = await this.model.find({ 'uploadedBy': filterByUploader });
                res.send(item);
            }
            else {
                const items = await this.model.find();
                res.send(items);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    };

    async getItemById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const item = await this.model.findById(id);
            if (item != null) {
                res.send(item);
            } else {
                res.status(404).send("not found");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    };

    async addItem(req: Request, res: Response) {
        const body = req.body;
        try {
            const item = await this.model.create(body);
            res.status(201).send(item);
        } catch (error) {
            res.status(400).send(error);
        }
    };

    async updateItem(req: Request, res: Response) {
        try {
            const itemId = req.params.id;
            const item = await this.model.findByIdAndUpdate(
                itemId,
                {
                    _id: itemId,
                    ...req.body
                },
                { new: true });
            res.status(200).send(item);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async deleteItem(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const response = await this.model.findByIdAndDelete(id);
            res.status(200).send(response);
        } catch (error) {
            res.status(400).send(error);
        }
    };

}
export default BaseController