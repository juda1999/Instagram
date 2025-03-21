import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { commentsRouter } from "./routes/comments.router";
import { postsRouter } from "./routes/posts.router";
import { authRouter } from "./routes/auth.router";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors"
import { userRouter } from "./routes/user.router";
import { imagesRouter } from "./routes/images.router";
import multer from "multer";
import fs from "fs"
import path from "path";

export const app = express();
dotenv.config();

mongoose.connect(process.env.DB_URL ?? "");
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected to Mongo :)'));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", "*")
  next()
})
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json());

app.use('/image', imagesRouter);
app.use('/post', postsRouter);
app.use('/comment', commentsRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

// Serve React static files
const frontPoth = path.join(__dirname, 'instagram-client');
app.use(express.static(frontPoth));
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(frontPoth, 'index.html'));
})

if (process.env.NODE_ENV === "Deployment") {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Instagram REST API",
        version: "1.0.0",
        description: "Final Project",
      },
      servers: [{ url: "http://localhost:3001", },],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

export const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_URL) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_URL)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

export const upload = multer({ storage });
