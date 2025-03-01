import { postModel, Post } from "../models/post";
import axios from 'axios';
import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import OpenAI from "openai";

// move to env
const a = "sk-p ro j-dFVR Hp8i xLVMYV  pa8Bgu4TCd b 0gNOL BgbC8q vCW0YHG-qhLK6Lbn12vqy9Dz7uJgY5DohwfvgT3BlbkFJBShL93lAMLjDRAOXb2sbbcJqGxdHzLACvf3g0NxN2Zy9LKU-oiB1NV5YJz4sLjw417pmYn8uIA";
const OPENAI_URL = 'https://api.open ai.com/v1/completions';
const openai = new OpenAI({baseURL: "https://api.aimlapi.com", apiKey: 'e4db56dcc09e4e5e88b5a60b4f62915c' });

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
    const skip = parseInt(req.body.skip) || 0;
    const limit = parseInt(req.body.limit) || 10;

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

  async summarize(req: Request, res: Response) {
    const text = req.body.text;
    if (!text) {
      res.status(400).send();
      return
    }

    console.log(req.body)

    try {
      // const completion = await openai.chat.completions.create({
      //   model: "gpt-4o-mini",
      //   messages: [
      //     { role: "developer", content: "You are helping a user write better posts, i will send a text and summarize it better thanks" },
      //     {
      //       role: "user",
      //       content: `Summarize this text: ${text}`,
      //     },
      //   ],
      //   max_tokens: 256,
      //   temperature: 0.7
      // });

      const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          "Authorization": "Bearer e4db56dcc09e4e5e88b5a60b4f62915c",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "max_tokens": 512,
          "max_completion_tokens": 1,
          "n": 1,
          "seed": 1,
          "stream": false,
          "top_p": 1,
          "temperature": 1,
          "parallel_tool_calls": true,
          "model": "gpt-4o-mini",
          "reasoning_effort": "low",
          "stream_options": {
            "include_usage": true
          },
          "stop": "text",
          "tool_choice": "none",
          "tools": [
            {
              "type": "function",
              "function": {
                "description": "text",
                "name": "text",
                "parameters": null,
                "required": [
                  "text"
                ]
              }
            }
          ],
          "response_format": {
            "type": "text"
          },
          "messages": [
            {
              "name": "text",
              "role": "system",
              "content": "text"
            }
          ]
        })
    });
    
    const data = await response.json();
    

      // const summary = completion.choices[0];
      console.log(data)
      res.status(200).send("");
    } catch (error) {
      console.error(error)
      res.status(500).send(error)
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
