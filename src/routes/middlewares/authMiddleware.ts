import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

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