import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import {User} from '../../dataBase/models'


dotenv.config();

export const protect = asyncHandler(async (req, res, next) => {
    console.log(req.cookies);
    const rawToken = req.cookies.jwt;

    if (rawToken) {

        try {
            const decoded = jwt.verify(rawToken, process.env.jwtKey);
            // @ts-ignore
            req.body.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, invalid token');
        }

    } else {

        res.status(401).json({message: 'no token'});
        // res.status(401);
        // throw new Error('Not authorized, no token');
    }
});

export const authMiddleware = (request, response, next) => {
    try {
        if (request.method === 'OPTIONS') {
            return next();
        }

        console.log('request.headers', request.headers);
        const token = request.headers.authorization.split(' ')[1];

        if (!token) {
            console.log('error token');
            // return response.status(401).json({message: 'not authorized user from mw'});
            throw new Error('authorization token wasn\'t sended');
        }

        const jwtKey = process.env.jwtKey;
        let data;

        try {
            data = jwt.verify(token, jwtKey);
        } catch (e) {
            throw new Error('authorization token is expired');
        }

        request.body.telegramNickname = data.telegramNickname;
        next();


    } catch (e) {
        console.log('from middleware, error', e);
        // throw new Error(e.message);
        return response.status(401).json({message: e.message});
    }
};