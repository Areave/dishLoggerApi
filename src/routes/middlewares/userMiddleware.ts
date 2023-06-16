import {User} from "../../dataBase/models";

export const userMiddleware = async (request, response, next) => {
    try {
        // console.log('userId middleware', request.body.userId);
        const user = await User.findOne({_id: request.body.userId});
        if (!user) {
            throw new Error('User not exist in database');
        }
        // console.log('userId', request.body.userId);
        // console.log('user', user);

        request.body.user = user;
        next();
    } catch (e) {
        console.log('from userMiddleware, error', e);
        return response.status(401).json({message: e.message});
    }
};