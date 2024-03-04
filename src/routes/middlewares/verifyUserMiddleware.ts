import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import {Meal, User} from '../../dataBase/models'
import {messageTypes} from "../../utils/entitiesLists";
import {rebaseIngridients} from "../../utils/rebaseIngridients";
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

            const user = await User.findById(decoded.userId).select('-password')
                // .populate('meals')
                // .populate({
                //     path: 'meals.$',
                //     populate: {
                //         path: 'ingridients._id',
                //         populate: {
                //             path: 'ingridient'
                //         }
                //     }
                // })
                // .populate({
                //     path: 'meals.$',
                //     populate: {
                //         path: 'ingridients.$',
                //         populate: 'ingridient'
                //     }
                // })
            // .populate({
            //         path: 'meals.ingridients.$',
            //         populate: 'ingridient'
            //     }
            // )

            // @ts-ignore
            // console.log('ingr: ',
            //     user.meals &&
            //     // @ts-ignore
            //     user.meals[0].ingridients &&
            //     // @ts-ignore
            //     user.meals[0].ingridients[0] &&
            //     // @ts-ignore
            //     user.meals[0].ingridients[0].ingridient);

            // if (user.meals[0]) {
            //     // @ts-ignore
            //     user.meals[0].ingridientsIds.forEach((idObject, index) => console.log(index, idObject));
            // }

            // @ts-ignore

            // .exec((error, docs) => console.log('error', error, 'docs', docs));
            // const user = await User.findById(decoded.userId).select('-password').populate('products dishes meals');
            if (!user) {
                res.status(401).json({
                    type: messageTypes.ERROR,
                    text: 'No such user'
                });
            } else {
                // console.log('user.meals before rebase ingridients', user.meals);
                // user.meals = (rebaseIngridients(user.meals));
                // console.log('user.meals after rebase ingridients', user.meals);
                req.body.user = user;

                // const reqData = {
                //     data: req.body,
                //     user
                // };
                // // console.log(reqData);
                // req.body = reqData;
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