import { postModel, Post } from "../models/post";
import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import OpenAI from "openai";
import { upload } from "../server";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ baseURL: "https://api.aimlapi.com", apiKey: process.env.OPENAI_TOKEN });

class PostsController extends BaseController<Post> {
  constructor() {
    super(postModel);
  }

  async getPagedPosts(req: Request, res: Response) {
    const filterByUploader = req.query.uploader;
    const filterByIds = req.body.filterIds;
    const skip = parseInt(req.body.skip) || 0;
    const limit = parseInt(req.body.limit) || 10;

    try {
      let posts;
      if (filterByUploader) {
        posts = await this.model.find({ 'uploadedBy': filterByUploader }).skip(skip).limit(limit);
      } else if(filterByIds) {
        posts = await this.model.find({
          '_id': filterByIds
         }).skip(skip).limit(limit);
      } else {
        posts = await this.model.find().skip(skip).limit(limit);
      }
      res.json(posts);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching posts', error });
    }
  }

  async summarize(req: Request, res: Response) {
    const text = req.body.text;
    if (!text) {
      res.status(400).send();
      return
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `I am writing a post description.make this sound the best.send back the new text without additions: "${text}"`,
          },
        ],
        max_tokens: 256,
        temperature: 0.7
      });

      res.status(200).send(completion.choices[0].message.content);
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
    }
  }

  async create(req: Request, res: Response) {
    const uploadMiddleware = upload.single('image');
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: 'Error uploading file', error: err });
      }

      try {
        const { title, content, uploadedBy, _id } = req.body;

        const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
        let savedPost;
        if (!_id) {
          savedPost = await this.model.create(
            {
              title,
              description: content,
              photo: imagePath,
              uploadedAt: new Date(),
              uploadedBy
            });
        } else {
          savedPost = await this.model.findByIdAndUpdate({ _id },
            {
              title,
              description: content,
              photo: imagePath,
              uploadedAt: new Date(),
              uploadedBy
            }, { new: true });
        }
        res.status(200).json(savedPost);
      } catch (err) {
        res.status(500).json({ message: 'Error saving post', error: err });
      }
    });
  }
}

export default new PostsController();
