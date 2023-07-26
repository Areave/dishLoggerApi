import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import {User} from '../../dataBase/models'
import {messageTypes} from "../../utils/entitiesLists";

dotenv.config();

export const verifyUser = asyncHandler(async (req, res, next) => {

    if (req.method === "OPTIONS") {
        return next();
    }

    // if (req.headers.referer === 'http://127.0.0.1:4000/') {
    //     const user = await User.findById('6495366ebb7d346edcd650bf').populate('meals').select('-password -role');
    //     req.body.user = user;
    //     return next();
    // }

    const rawToken = req.cookies.jwt;
    if (rawToken) {
        try {
            const decoded = jwt.verify(rawToken, process.env.jwtKey);
            const user = await User.findById(decoded.userId).select('-password -role').populate('meals');
            if (!user) {
                console.log('middleware error');
                res.status(401).json({
                    message: {
                        type: messageTypes.ERROR,
                        text: 'No such user'
                    }
                });
            } else {
                const newData = req.body;
                req.body = {user, newData};
                next();
            }
        } catch (error) {
            console.log('middleware error');
            res.status(401).json({
                message: {
                    type: messageTypes.ERROR,
                    text: 'Not authorized'
                }, stack: error.message
            });
        }
    } else {
        console.log('middleware error');
        res.status(401).json({
            message: {
                type: messageTypes.ERROR,
                text: 'Not authorized'
        }});
    }
});