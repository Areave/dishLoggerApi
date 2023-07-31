import asyncHandler from 'express-async-handler';
import {messageTypes, roles} from "../../utils/entitiesLists";

export const authorUser = asyncHandler(async (req, res, next) => {

    if (req.method === "OPTIONS") {
        return next();
    }

    const role = req.body.user.role;

    if (role !== roles.ADMIN) {
        res.status(401).json({
                type: messageTypes.ERROR,
                text: 'No access to data'
            });
    } else {
        return next()
    }
});