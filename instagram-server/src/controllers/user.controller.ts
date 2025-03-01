import { commentModel, Comment } from "../models/comment";
import { User, userModel } from "../models/user";
import {BaseController} from "./base.controller";
import { Request, Response } from "express";

class UserController extends BaseController<User> {
    constructor() {
      super(userModel);
    }
  }

export const userController = new UserController()


