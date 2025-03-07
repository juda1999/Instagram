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
 *       description: Retrieve all posts from the database with optional filtering and pagination.
 *       requestBody:
 *         required: false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filterIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Optional array of post IDs to filter results.
 *                 limit:
 *                   type: integer
 *                   description: Number of posts to return per page.
 *                 skip:
 *                   type: integer
 *                   description: Number of posts to skip for pagination.
 *       tags: [Post]
 *       responses:
 *         200:
 *           description: List of all posts with optional filtering and pagination.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *   /post/create:
 *     post:
 *       summary: Create or update a post
 *       security:
 *         - bearerAuth: []
 *       description: Upload a new post with an optional image or update an existing one.
 *       tags: [Post]
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the post (only required for updates).
 *                 title:
 *                   type: string
 *                   description: The title of the post.
 *                 content:
 *                   type: string
 *                   description: The content or description of the post.
 *                 uploadedBy:
 *                   type: string
 *                   description: The ID of the user who uploaded the post.
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: Optional image file for the post.
 *       responses:
 *         200:
 *           description: Post created or updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *         400:
 *           description: Error uploading file or invalid request data.
 *         500:
 *           description: Server error while saving the post.
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
 *   /post/uploader:
 *     post:
 *       summary: Get all posts by uploaderId
 *       security:
 *         - bearerAuth: []
 *       description: Retrieve all postsby an uploader with pagination
 *       requestBody:
 *         required: false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filterIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Optional array of post IDs to filter results.
 *                 limit:
 *                   type: integer
 *                   description: Number of posts to return per page.
 *                 skip:
 *                   type: integer
 *                   description: Number of posts to skip for pagination.
 *       tags: [Post]
 *       responses:
 *         200:
 *           description: List of all posts by uploader id
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *   /post/summarize:
 *     post:
 *       summary: Summarize a post description
 *       security:
 *         - bearerAuth: []
 *       description: Uses AI to enhance the given text for a post description.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: The text to be enhanced.
 *       responses:
 *         200:
 *           description: Returns the improved post description.
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *         400:
 *           description: Text is required in the request body.
 *         500:
 *           description: Error processing the AI-generated text.
 *       tags: [Post]
 */

postsRouter.post('/', authMiddleware, postsController.getPagedPosts.bind(postsController));
postsRouter.post('/create', authMiddleware, postsController.create.bind(postsController));
postsRouter.get('/:id', authMiddleware, postsController.getItemById.bind(postsController));
postsRouter.post('/uploader', authMiddleware, postsController.getPagedPosts.bind(postsController));
postsRouter.put('/:id', authMiddleware, postsController.updateItem.bind(postsController));
postsRouter.delete('/:id',authMiddleware, postsController.deleteItem.bind(postsController));
postsRouter.post('/summarize',authMiddleware, postsController.summarize.bind(postsController));
