import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'
import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const authRouter = Router({strict: true});


// auth/gettoken
authRouter.post('/gettoken', async (req: Request, res: Response) => {
    try {
        const {telegramNickname} = req.body;
        if(!telegramNickname) {
            throw new Error('no telegram nickname was sended')
        }
        // console.log('telegramNickname from authRouter', telegramNickname, req.body);
        const jwtKey = process.env.jwtKey;
        const token = jwt.sign(
            {telegramNickname: telegramNickname},
            jwtKey,
            {expiresIn: 60*60}
        );
        // console.log('return token', token);
        res.status(201).json({token});
    } catch (error) {
        console.log('from router', error.message);
        res.status(500).json({message: error.message})
    }
});
