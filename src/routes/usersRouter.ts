import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'
import dotenv from 'dotenv'
import {check, validationResult} from 'express-validator';
import generateToken from "../utils/generateToken";
import {verifyUser} from "./middlewares/authMiddleware";
import bcrypt from 'bcryptjs';
import {messageTypes} from "../utils/entitiesLists";

dotenv.config();

export const usersRouter = Router({strict: true});

// api/users/auth
usersRouter.post('/auth', [
    check('login', 'Login can\'t be empty').notEmpty(),
    check('password', 'Password has to be at least 4 chars long').isLength({min: 4}),
], async (req: Request, res: Response) => {
    const registrationErrors = validationResult(req);
    if (!registrationErrors.isEmpty()) {
        return res.status(400).json({
            message: {
                type: messageTypes.ERROR,
                text: 'Registration error',
                errors: registrationErrors.array(),
            }
        });
    }
    try {
        const {login, password, name, role} = req.body;
        const user = await User.exists({login});
        if (user) {
            return res.status(400).json({
                message: {
                    type: messageTypes.ERROR,
                    text: 'User already exists'
                }
            });
        }
        const newUser = await User.create({login, name, password, role});
        generateToken(res, newUser._id);
        res.status(201).json({message: {
                type: messageTypes.SUCCESS,
                text: 'User created successfully'
            }, user: {login, name}});
    } catch (error) {
        console.log('from usersRouter', error.message);
        res.status(500).json({
            message: {
                type: messageTypes.ERROR,
                text: 'Database problems'
            }, stack: error.message
        })
    }
});

// api/users/login
usersRouter.post('/login', [
    check('login', 'Login can\'t be empty').notEmpty(),
    check('password', 'Password can\'t be empty').notEmpty(),
], async (req: Request, res: Response) => {

    if (req.cookies.jwt) {
        return res.status(200).json({message: {
                type: messageTypes.SUCCESS,
                text: 'You are already logged in'
            }});
    }

    const loginErrors = validationResult(req);
    if (!loginErrors.isEmpty()) {
        return res.status(400).json({
            message: {
                type: messageTypes.ERROR,
                text: 'Login or password is wrong',
                errors: loginErrors.array(),
            }
        });
    }
    try {
        const {login, password} = req.body;
        const user = await User.findOne({login}).populate('meals').select('-role');

        // @ts-ignore
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({message: {
                    type: messageTypes.ERROR,
                    text: 'Login or password is wrong'
                }});
        }
        generateToken(res, user._id);
        user.password = '';
        res.status(200).json({
            message: {
                type: messageTypes.SUCCESS,
                text: 'You successfully logged in',
            }, user
        });
    } catch (error) {
        res.status(500).json({
            message: {
                type: messageTypes.ERROR,
                text: 'Database problems'
            }, stack: error.message
        });
    }
});

// api/users/logout
usersRouter.post('/logout', (req: Request, res: Response) => {
    if (req.cookies.jwt) {
        res.cookie('jwt', '', {
            httpOnly: true,
            // secure: process.env.NODE_ENV !== 'development',
            secure: true,
            sameSite: 'none',
            // @ts-ignore
            expired: new Date(0),

        });
        res.status(200).json({message: {
                type: messageTypes.SUCCESS,
                text: 'Successfully logged out'
            }});
    } else {
        res.status(200).json({message: {
                type: messageTypes.SUCCESS,
                text: 'You are already logged out'
            }});
    }
});

// api/users/get
usersRouter.get('/get', verifyUser, (req: Request, res: Response) => {
    res.status(200).json(req.body.user);
});

// api/users/get_all
usersRouter.get('/get_all', async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: {
                type: messageTypes.ERROR,
                text: 'Database problems'
            },
            stack: error.message
        });
    }
});

// api/users/update
usersRouter.put('/update', verifyUser, async (req: Request, res: Response) => {
    const {user, newData} = req.body;
    if (newData.password) {
        try {
            // TODO: тут юзер может ввести пароль короче минимума, нужно проверять
            newData.password = await bcrypt.hash(newData.password, await bcrypt.genSalt(10))
        } catch (error) {
            res.status(500).json({
                message: {
                    type: messageTypes.ERROR,
                    text: 'Database problems'
                },
                stack: error.message
            });
        }
    }
    try {
        // TODO: небезопасно, пользователь может через подмену кода поменять любые поля
        const updatedUser = await User.findOneAndUpdate({_id: user._id}, newData, {
            new: true
        }).select('-password -role');
        if (newData.password || newData.login) {
            res.cookie('jwt', '', {
                httpOnly: true,
                // @ts-ignore
                expired: new Date(0),
            });
            return res.status(201).json({message: {
                    type: messageTypes.SUCCESS,
                    text: 'User data was updated, login again'
                }});
        }
        res.status(201).json({
            message: {
                type: messageTypes.SUCCESS,
                text: 'User data was updated'
            },
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: {
                type: messageTypes.ERROR,
                text: 'Database problems'
            },
            stack: error.message
        });
    }
});

// api/users/delete_all
usersRouter.delete('/delete_all', async (req: Request, res: Response) => {
    try {
        await User.deleteMany({});
        res.status(200).json({message: {
                type: messageTypes.SUCCESS,
                text: 'Users was deleted'
            }});
    } catch (error) {
        res.status(500).json({
            message: {
                type: messageTypes.ERROR,
                text: 'Database problems'
            },
            stack: error.message
        });
    }
});
