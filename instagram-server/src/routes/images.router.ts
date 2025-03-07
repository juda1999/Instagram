import { Request, Response, Router } from "express";
import fs from "fs"
import path from "path"

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
imagesRouter.get("/", (req: Request, res: Response) => {
    const imagePath = req.query.path as string;
    if (!imagePath) {
        res.status(400).send('Image path is required');
        return
    }

    const fullPath = path.join(__dirname, `../../${imagePath}`);
    try {
        fs.exists(fullPath, (exists) => {
            if (!exists) {
                return res.status(404).send('Image not found');
            }

            const extname = path.extname(fullPath).toLowerCase();
            let contentType = 'application/octet-stream';

            switch (extname) {
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
                case '.svg':
                    contentType = 'image/svg+xml';
                    break;
                default:
                    return res.status(415).send('Unsupported image format');
            }

            fs.readFile(fullPath, (err, data) => {
                if (err) {
                    return res.status(500).send('Error reading image');
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            });
        });

    } catch (error) {
        console.log(error)
    }
})
