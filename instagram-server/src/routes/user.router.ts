import { Router } from "express";
import { authMiddleware } from "../controllers/auth.controller";
import { userController } from "../controllers/user.controller";

export const userRouter = Router();

/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/

/**
 * @swagger
 * paths:
 *   /user/userInfo/{id}:
 *     get:
 *       summary: Get a user by ID
 *       security:
 *         - bearerAuth: []
 *       description: Retrieve a specific user by its ID
 *       tags: [User]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the user to retrieve
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: The user with the specified ID
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         404:
 *           description: User not found
 *   /user/update/{id}:
 *     post:
 *       summary: Get a user by ID
 *       security:
 *         - bearerAuth: []
 *       description: updates a user by its ID
 *       tags: [User]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the user to update
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         200:
 *           description: The user with the specified ID
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         404:
 *           description: User not found
 */
userRouter.get('/userInfo/:id', authMiddleware, userController.getItemById.bind(userController));
userRouter.post('/update/:id', authMiddleware, userController.updateUser.bind(userController));
