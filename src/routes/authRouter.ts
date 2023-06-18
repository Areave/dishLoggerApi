import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';
import {check, validationResult} from 'express-validator';
import generateToken from "../utils/generateToken";
import {userMiddleware} from "./middlewares/userMiddleware";


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
        if (candidate) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        // const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({login, name, password});
        // const user = new User({login, name, password: hashedPassword});
        // await user.save();
        generateToken(res, newUser._id);
        res.status(201).json({message: 'User created successfully', user: newUser});
    } catch (error) {
        console.log('from authRouter', error.message);
        res.status(500).json({message: 'Database problems', stack: error.message})
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

        // @ts-ignore
        if (!user || !(await user.matchPassword(password))) {
            console.log(user);
            return res.status(400).json({message: 'No such a user'});
        }

        generateToken(res, user._id);
        res.status(200).json({message: 'You successfully logged in', user});
    } catch (error) {
        console.log('from authRouter', error.message);
        res.status(500).json({
            message: 'Database error',
            stack: error.message
        });
    }
});

// api/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {

    // console.log(res.client.cookies.jwt);
    //TODO: смотреть не вышел ли уже, как получить cookie?
    //     if (res.header('Set-Cookie')) {
            res.cookie('jwt', '', {
                httpOnly: true,
                // @ts-ignore
                expired: new Date(0),
            });
            res.status(200).json({message: 'Successfully logged out'});
        // } else {
        //     res.status(200).json({message: 'You are already logged out'});
        // }

});