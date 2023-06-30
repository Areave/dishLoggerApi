import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'
import dotenv from 'dotenv'
import {check, validationResult} from 'express-validator';
import generateToken from "../utils/generateToken";
import {verifyUser} from "./middlewares/authMiddleware";
import bcrypt from 'bcryptjs';

dotenv.config();

export const usersRouter = Router({strict: true});

// api/users/auth
usersRouter.post('/auth', [
    check('login', 'Login can\'t be empty').notEmpty(),
    check('password', 'Password has to be at least 2 chars long').isLength({min: 2}),
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
        const user = await User.exists({login});
        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        const newUser = await User.create({login, name, password});
        // generateToken(res, newUser._id);
        res.status(201).json({message: 'User created successfully', user: {login, name}});
    } catch (error) {
        console.log('from usersRouter', error.message);
        res.status(500).json({message: 'Database problems', stack: error.stackTrace})
    }
});

// api/users/login
usersRouter.post('/login', [
    check('login', 'Login can\'t be empty').notEmpty(),
    check('password', 'Password can\'t be empty').notEmpty(),
], async (req: Request, res: Response) => {

    if (req.cookies.jwt) {
        return res.status(200).json({message: 'You are already logged in'});
    }

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
            return res.status(400).json({message: 'No such a user'});
        }
        generateToken(res, user._id);
        user.password = '';
        res.status(200).json({message: 'You successfully logged in', user});
    } catch (error) {
        res.status(500).json({
            message: 'Database error',
            stack: error.message
        });
    }
});

// api/users/logout
usersRouter.post('/logout', (req: Request, res: Response) => {
    console.log('logout route, req.cookies.jwt', req.cookies.jwt);
    if (req.cookies.jwt) {
        res.cookie('jwt', '', {
            httpOnly: true,
            // secure: process.env.NODE_ENV !== 'development',
            secure: true,
            sameSite: 'none',
            // @ts-ignore
            expired: new Date(0),
            // httpOnly: true,

        });
        res.status(200).json({message: 'Successfully logged out'});
    } else {
        res.status(200).json({message: 'You are already logged out'});
    }
});

// api/users/get
usersRouter.get('/get', verifyUser, (req: Request, res: Response) => {
    res.status(200).json(req.body.user);
});

// api/users/get_all
usersRouter.get('/get_all', async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Database error',
            stack: error.message
        });
    }
});

// api/users/update
usersRouter.put('/update', verifyUser, async (req: Request, res: Response) => {
    const {user, newUser} = req.body;
    try {
        if (newUser.password) {
            newUser.password = await bcrypt.hash(newUser.password, await bcrypt.genSalt(10))
        }
        const updatedUser = await User.findOneAndUpdate({_id: user._id}, newUser, {
            new: true
        }).select('-password');
        if (newUser.password || newUser.login) {
            res.cookie('jwt', '', {
                httpOnly: true,
                // @ts-ignore
                expired: new Date(0),
            });
            return res.status(201).json({message: 'User data was updated, login again'});
        }
        res.status(201).json(updatedUser);
    } catch (error) {
        return res.status(500).json({
            message: "Database problems",
            stack: error.message
        });
    }
});

// api/users/delete_all
usersRouter.delete('/delete_all', async (req: Request, res: Response) => {
    try {
        await User.deleteMany({});
        res.status(200).json({message: 'Users was deleted'});
    } catch (error) {
        res.status(500).json({
            message: 'Database error',
            stack: error.message
        });
    }
});
