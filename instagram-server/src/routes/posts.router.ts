import { Router } from 'express';
import  postsController  from "../controllers/posts.controller";
import { authMiddleware } from '../controllers/auth.controller';

export const postsRouter = Router();
/**
* @swagger
* tags:
*   name: Post
*   description: The Posts API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - uploadedBy
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         description:
 *           type: string
 *           description: The content or description of the post
 *         uploadedBy:
 *           type: string
 *           description: The ID of the user who uploaded the post
 *       example:
 *         title: "Test title"
 *         description: "Test description"
 *         uploadedBy: "6766b07ed176ee0ca0ea6105"
*/

/**
 * @swagger
 * paths:
 *   /post:
 *     post:
 *       summary: Get all posts
 *       security:
 *         - bearerAuth: []
 *       description: Retrieve all posts from the database
 *       tags: [Post]
 *       responses:
 *         200:
 *           description: List of all posts
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *   /post/create:
 *     post:
 *       summary: Create a new post
 *       description: Adds a new post to the database
 *       security:
 *         - bearerAuth: []
 *       tags: [Post]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       responses:
 *         201:
 *           description: Post created successfully
 *         400:
 *           description: Bad request (e.g., missing required fields)
 *   /post/{id}:
 *     get:
 *       summary: Get a post by ID
 *       security:
 *         - bearerAuth: []
 *       description: Retrieve a specific post by its ID
 *       tags: [Post]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the post to retrieve
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: The post with the specified ID
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *         404:
 *           description: Post not found
 *     put:
 *       summary: Update a post by ID
 *       description: Updates a specific post by its ID
 *       tags: [Post]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the post to retrieve
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       responses:
 *         200:
 *           description: Post Updated successfully
 *         400:
 *           description: Bad request
 *     delete:
 *       summary: Delete a post by ID
 *       description: Deletes a specific post by its ID
 *       tags: [Post]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: The ID of the post to delete
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Post deleted successfully
 *         404:
 *           description: Post not found
 *   /post?uploader={userId}:
 *     get:
 *       summary: Get posts by a specific uploader
 *       security:
 *         - bearerAuth: []
 *       description: Retrieve posts uploaded by a specific user
 *       tags: [Post]
 *       parameters:
 *         - in: query
 *           name: uploader
 *           required: true
 *           description: The ID of the user who uploaded the posts
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: List of posts uploaded by the specified user
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *         404:
 *           description: No posts found for the given user
 */

postsRouter.post('/', authMiddleware, postsController.getPagedPosts.bind(postsController));
postsRouter.post('/create', authMiddleware, postsController.create.bind(postsController));
postsRouter.get('/:id', authMiddleware, postsController.getItemById.bind(postsController));
postsRouter.post('/uploader', authMiddleware, postsController.getPagedPosts.bind(postsController));
postsRouter.put('/:id', authMiddleware, postsController.updateItem.bind(postsController));
postsRouter.delete('/:id',authMiddleware, postsController.deleteItem.bind(postsController));
postsRouter.post('/summarize',authMiddleware, postsController.summarize.bind(postsController));
