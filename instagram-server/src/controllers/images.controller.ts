import { Request, Response } from "express";
import fs from "fs"
import path from "path"

class ImagesController {
    getImage = (req: Request, res: Response) => {
        const imagePath = req.query.path as string;
        console.log(req.query)
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
    }
}
export const imagesController = new ImagesController()


