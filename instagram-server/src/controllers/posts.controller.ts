import { postModel, Post } from "../models/post";
import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

class PostsController extends BaseController<Post> {
  constructor() {
    super(postModel);
  }

  async getPagedPosts(req: Request, res: Response) {
    const filterByUploader = req.query.uploader;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      let posts;
      if (filterByUploader) {
        posts = await this.model.find({ 'uploadedBy': filterByUploader }).skip(skip).limit(limit);
      } else {
        posts = await this.model.find().skip(skip).limit(limit);
      }
      res.json(posts);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching posts', error });
    }
  }

  async create(req: Request, res: Response) {
    const uploadMiddleware = upload.single('image');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err });
      }

      const { title, content, uploadedBy } = req.body;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

      try {
        console.log({
          title,
          description: content,
          photo: imagePath,
          uploadedAt: new Date(),
          uploadedBy
        })
        const savedPost = await this.model.create({
          title,
          description: content,
          photo: imagePath,
          uploadedAt: new Date(),
          uploadedBy
        });
        return res.status(200).json(savedPost);
      } catch (err) {
        return res.status(500).json({ message: 'Error saving post', error: err });
      }
    });
  }
}

export default new PostsController();
