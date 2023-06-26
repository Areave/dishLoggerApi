import {Router, Request, Response} from 'express';
import {User, Stat} from './../dataBase/models';
import {rebaseIngridientsMiddleware} from "./middlewares/rebaseIngridientsMiddleware";

export const statsRouter = Router({strict: true});
// api/stats/add
statsRouter.post('/set', rebaseIngridientsMiddleware, async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send();
});

// api/stats/get_stat
statsRouter.post('/get_stat', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send();
});

// api/stats/update_stat
statsRouter.post('/update_stat', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send();
});

