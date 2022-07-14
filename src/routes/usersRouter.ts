import {Router, Request, Response} from 'express';


export const usersRouter = Router({strict: true});

// users/registration
usersRouter.get('/registration', (req: Request, res: Response): Promise<Response> => {
    throw new Error("Method not implemented.");
});

// users/authentication
usersRouter.post('/authentication', (req: Request, res: Response): Promise<Response> => {
    throw new Error("Method not implemented.");
});

// users/login
usersRouter.patch('/login', (req: Request, res: Response): Promise<Response> => {
    throw new Error("Method not implemented.");
});
