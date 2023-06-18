import {Router, Request, Response} from 'express';
import {userMiddleware} from "./middlewares/userMiddleware";
import {User} from "../dataBase/models";


export const userRouter = Router({strict: true});

// const setNewDataToField = async (user, fieldName: string, newValue, res) => {
//     try {
//         await User.updateOne({_id: user._id}, {fieldName: newValue});
//         return res.status(201).json(products);
//     } catch (error) {
//         // console.log('from productRouter', error.message);
//         return res.status(500).json({message: "Database problems"});
//     }
// };

// user/set_new_login
userRouter.get('/registration', userMiddleware, (req: Request, res: Response): Promise<Response> => {
    throw new Error("Method not implemented.");
});

// user/set_new_password
userRouter.post('/authentication', (req: Request, res: Response): Promise<Response> => {
    throw new Error("Method not implemented.");
});

// user/set_new_name
userRouter.patch('/login', (req: Request, res: Response): Promise<Response> => {
    throw new Error("Method not implemented.");
});

// user/set_new_intake_data
userRouter.patch('/login', (req: Request, res: Response): Promise<Response> => {
    throw new Error("Method not implemented.");
});
