import { Request, Response, Router } from "express";
import { authMiddleware } from "../controllers/auth.controller";
import { imagesController } from "../controllers/images.controller";


export const imagesRouter = Router();

/**
 * @swagger
 * paths:
 *   /images:
 *     get:
 *       summary: Retrieve an image by its file path
 *       description: Fetch an image from the server using its relative file path.
 *       parameters:
 *         - in: query
 *           name: path
 *           schema:
 *             type: string
 *           required: true
 *           description: The relative file path of the image.
 *       responses:
 *         200:
 *           description: Successfully retrieved image
 *           content:
 *             image/jpeg:
 *               schema:
 *                 type: string
 *                 format: binary
 *             image/png:
 *               schema:
 *                 type: string
 *                 format: binary
 *             image/gif:
 *               schema:
 *                 type: string
 *                 format: binary
 *             image/svg+xml:
 *               schema:
 *                 type: string
 *                 format: binary
 *         400:
 *           description: Image path is required
 *         404:
 *           description: Image not found
 *         415:
 *           description: Unsupported image format
 *         500:
 *           description: Error reading image
 *       tags:
 *         - Images
 */
imagesRouter.get("/",authMiddleware, imagesController.getImage.bind(imagesController) )
