import { commentModel, Comment } from "../models/comment";
import { User, userModel } from "../models/user";
import { upload } from "../server";
import { BaseController } from "./base.controller";
import { Request, Response } from "express";

class UserController extends BaseController<User> {
  constructor() {
    super(userModel);
  }

  updateUser(req: Request, res: Response) {
    const uploadMiddleware = upload.single('profilePicture');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading profile picture', error: err });
      }

      const { email, firstName, username, lastName, likedPosts } = req.body;
      const profilePicturePath = req.file ? `/uploads/${req.file.filename}` : undefined;

      try {
        const user = await userModel.findOneAndUpdate(
          {
            _id: req.params.id
          },
          {
            email,
            username,
            lastName,
            firstName,
            likedPosts,
            profilePicture: profilePicturePath,
          },
          {
            new: true
          });
        res.status(200).send(user)
      } catch (err) {
        res.status(400).send({ message: 'Error registering user', error: err });
      }
    });
  }
}

export const userController = new UserController()


