import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'
import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';
import {check, validationResult} from 'express-validator';

dotenv.config();

export const authRouter = Router({strict: true});

// api/auth/registration
authRouter.post('/registration', [
    check('login', 'Login can\'t be empty').notEmpty(),
    check('password', 'Password has to be at least 2 chars').isLength({min: 2}),
], async (req: Request, res: Response) => {
    const registrationErrors = validationResult(req);
    if (!registrationErrors.isEmpty()) {
        return res.status(400).json({
            errors: registrationErrors.array(),
            message: 'Registration error'
        });
    }
    try {
        const {login, password, name} = req.body;
        const candidate = await User.findOne({login});
        if(candidate) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({login, name, password: hashedPassword});
        await user.save();
        return res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        console.log('from authRouter', error.message);
        res.status(500).json({message: error.message})
    }
});

// api/auth/login
authRouter.post('/login', [
    check('login', 'Login can\'t be empty').notEmpty(),
    check('password', 'Password can\'t be empty').notEmpty(),
], async (req: Request, res: Response) => {
    const loginErrors = validationResult(req);
    if (!loginErrors.isEmpty()) {
        return res.status(400).json({
            errors: loginErrors.array(),
            message: 'Login error'
        });
    }
    try {
        const {login, password} = req.body;
        const user = await User.findOne({login});
        if (!user) {
            return res.status(400).json({message: 'No such a user as ' + login});
        }
        const dbHashPassword = user.password;
        const isPasswordMatch = await bcrypt.compare(password, dbHashPassword);
        if (!isPasswordMatch) {
            return res.status(400).json({message: 'Incorrect password'});
        }
        return res.status(200).json({userId: user.id});
    } catch (error) {
        console.log('from authRouter', error.message);
        res.status(500).json({message: error.message});
    }
});


// // auth/gettoken
// authRouter.post('/gettoken', async (req: Request, res: Response) => {
//     try {
//         console.log('req.body', req.body);
//         const {telegramNickname} = req.body;
//         if (!telegramNickname) {
//             throw new Error('no telegram nickname was sended')
//         }
//         // console.log('telegramNickname from authRouter', telegramNickname, req.body);
//         const jwtKey = process.env.jwtKey;
//         const token = jwt.sign(
//             {telegramNickname: telegramNickname},
//             jwtKey,
//             {expiresIn: 60 * 60 * 60}
//         );
//         // console.log('return token', token);
//         res.status(201).json({token});
//     } catch (error) {
//         console.log('from router', error.message);
//         res.status(500).json({message: error.message})
//     }
// });
