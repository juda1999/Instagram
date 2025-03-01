import { Router } from "express";
import { authMiddleware } from "../controllers/auth.controller";
import { userController } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get('/userInfo/:id', authMiddleware, userController.getItemById.bind(userController));
userRouter.post('/update/:id', authMiddleware, userController.updateItem.bind(userController));
