import { NextFunction, Request, Response } from 'express';
import {userModel, User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

export const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email: req.body.email,
            password: hashedPassword,
            firstName: req.body.firstName,
        });
        const tokens = generateToken(user.id)
        res.status(200).send({
            user,
            accessToken: tokens?.accessToken
         });
    } catch (err) {
        res.status(400).send(err);
    }
};

type Tokens = {
    accessToken: string,
    refreshToken: string
}

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
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate token
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
export const verifyRefreshToken = (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {
        if (!refreshToken) {
            console.log(103)

            reject("fail");
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            console.log(107)
            reject("fail");
            return;
        }
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject("fail");
                console.log(113)
                return
            }
            //get the user id fromn token
            const userId = payload._id;
            try {
                //get the user form the db
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
                console.log(131)
                return;
            }
        });
    });
}

export const logout = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        await user.save();
        res.status(200).send("success");
    } catch (err) {
        res.status(400).send("fail");
    }
};

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findById(req.body.userId);
        res.status(200).send({ user })
    } catch (error) {
        res.status(400).send("fail");

    }
}

export const refresh = async (req: Request, res: Response) => {
    try {
        const authorization = req.header("authorization");
        const token = authorization && authorization.split(' ')[1];
        const user = await verifyRefreshToken(token);
        if (!user) {
            console.log(166)
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
                user: user
            });
        //send new token
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
