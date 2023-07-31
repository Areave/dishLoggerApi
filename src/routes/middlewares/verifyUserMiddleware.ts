import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import {Meal, User} from '../../dataBase/models'
import {messageTypes} from "../../utils/entitiesLists";
import {handleDataBaseError} from "../../utils/handleDataBaseError";

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
            const user = await User.findById(decoded.userId).select('-password').populate('products dishes meals');
            // const user = await User.findById(decoded.userId).select('-password').populate('products dishes meals');
            if (!user) {
                res.status(401).json({
                        type: messageTypes.ERROR,
                        text: 'No such user'
                });
            } else {
                req.body.user = user;
                return next();
            }
        } catch (error) {
            handleDataBaseError(error, 401, res);
        }
    } else {
        res.status(401).json({
                type: messageTypes.ERROR,
                text: 'Not authorized'
        });
    }
});