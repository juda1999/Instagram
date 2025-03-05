import { NextFunction, Request, Response } from 'express';
import { userModel, User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const client = new OAuth2Client('552634801343-odnvmi18ds914j0hci9a6mhuqrbuvebk.apps.googleusercontent.com');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profile_pictures';
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

const upload = multer({ storage });

export const register = async (req: Request, res: Response) => {
    const uploadMiddleware = upload.single('profilePicture');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading profile picture', error: err });
        }

        const { email, password, firstName, username, lastName } = req.body;
        const profilePicturePath = req.file ? `/uploads/profile_pictures/${req.file.filename}` : undefined;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const user = await userModel.create({
                email,
                password: hashedPassword,
                username,
                lastName,
                firstName,
                profilePicture: profilePicturePath,
            });
            const tokens = generateToken(user.id);

            res.status(200).send({
                user,
                refreshToken: tokens?.refreshToken,
                accessToken: tokens?.accessToken,
            });
        } catch (err) {
            res.status(400).send({ message: 'Error registering user', error: err });
        }
    });
};

export const generateToken = (userId: string): Tokens | null => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }

    const random = Math.random().toString();
    const accessToken = jwt.sign({
        _id: userId,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES });

    const refreshToken = jwt.sign({
        _id: userId,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
    return {
        accessToken: `Bearer ${accessToken}`,
        refreshToken: refreshToken
    };
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password!);
        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }

        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user
            });

    } catch (err) {
        res.status(400).send(err);
    }
};

type tUser = Document<unknown, {}, User> & User & Required<{
    _id: string;
}> & {
    __v: number;
}

export const verifyToken = (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {
        if (!refreshToken) {
            reject("fail");
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            reject("fail");
            return;
        }
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject("fail");
                return
            }

            const userId = payload._id;
            try {
                const user = await userModel.findById(userId);
                if (!user) {
                    reject("fail");
                    return;
                }

                const tokens = user.refreshToken!.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;

                resolve(user);
            } catch (err) {
                reject("fail");
                return;
            }
        });
    });
}

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.googleToken,
            audience: '552634801343-odnvmi18ds914j0hci9a6mhuqrbuvebk.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();
        if (!payload) {
            res.sendStatus(500);
            return
        }

        const user: User = {
            email: payload.email ?? "",
            firstName: payload.given_name ?? "",
            lastName: payload.family_name
        }
        let existingUser = await userModel.findOne({ email: user.email });
        if (!existingUser) {
            existingUser = await userModel.create(user)
        }

        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate token
        const tokens = generateToken(existingUser._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }

        res.status(200).send({
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken,
            user: existingUser
        });
    } catch (error) {
        res.status(500).send("fail");
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        // const user = await verifyRefreshToken(req.body.refreshToken);
        // await user.save();
        res.status(200).send("success");
    } catch (err) {
        res.status(400).send("fail");
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
    } catch (err) {
        res.status(400).send("fail");
    }
};

export const tokenLogin = async (req: Request, res: Response) => {
    try {
        const authorization = req.header("authorization");
        const token = authorization && authorization.split(' ')[1];
        const user = await verifyToken(token);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                refreshToken: tokens.refreshToken,
                accessToken: tokens.accessToken,
                user: user
            });
    } catch (err) {
        res.status(400).send("fail");
    }
};

type Payload = {
    _id: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header("authorization");
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    });
};

type Tokens = {
    accessToken: string,
    refreshToken: string
}