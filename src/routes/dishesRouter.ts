import {Router, Request, Response} from 'express';
import {Dish} from './../dataBase/models';
import updateUsersItems from "../utils/updateUsersItems";
import {handleDataBaseError} from "../utils/handleDataBaseError";
import {ObjectId} from "bson";
import {messageTypes} from "../utils/entitiesLists";
import {rebaseIngridients} from "../utils/rebaseIngridients";

export const dishesRouter = Router({strict: true});

// api/dishes/add
dishesRouter.post('/add', async (req: Request, res: Response): Promise<Response> => {
    const {user, dish} = req.body;
    // console.log('req.body', req.body);
    // console.log('req', req);
    try {
        const candidate = await Dish.exists({name: dish.name, owner: user._id});
        if (candidate) {
            return res.status(400).json({
                message: {
                    type: messageTypes.ERROR,
                    text: "Duplicate name: " + dish.name
                }
            });
        }
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
    dish.owner = user._id;
    try {
        // Слабое место, нужно продолжать после успешного создания
        const newItem = await Dish.create({...dish});
        // const dishes = [...user.dishes, newItem._id];
        // return await updateUsersItems(res, user._id, Dish);
        const dishes = await Dish.find({owner: user._id}).select('-owner').populate({
                path:'ingridients.ingridient',
                // match: { 'type': 'MEAL' || 'DISH',}
            });
        return res.status(201).json(dishes);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/dishes/dish/:id
dishesRouter.get('/dish/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    let objectId;
    try {
        objectId = new ObjectId(req.params.id);
    } catch (error) {
        return handleDataBaseError(error, 400, res);
    }
    try {
        let dish = await Dish.findOne({owner: user._id, _id: objectId}).select('-owner').populate('ingridientsIds');
        if (!dish) {
            return res.status(400).json({
                message: {
                    type: messageTypes.ERROR,
                    text: "No such dish"
                }
            });
        }
        const dishWithIngridients = rebaseIngridients([dish])[0];
        res.status(201).json(dishWithIngridients);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/dishes/get_all
dishesRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        const userDishes = await Dish.find({owner: user._id}).select('-owner').populate('ingridients.ingridient');
        return res.status(200).json(userDishes);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/dishes/update
dishesRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, dish} = req.body;
    try {
        await Dish.updateOne({_id: dish._id}, {...dish});
        const dishes = await Dish.find({owner: user._id}).select('-owner').populate('ingridients.ingridient');
        return res.status(201).json(dishes);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/dishes/remove
dishesRouter.delete('/remove/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        await Dish.deleteOne({_id: req.params.id});
        // const dishes = user.dishes.filter(dish => {
        //     return dish._id != req.params.id;
        // });
        return await updateUsersItems(res, user._id, Dish);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/dishes/remove_all
dishesRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        await Dish.deleteMany({owner: user._id});
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
    const dishes = [];
    return await updateUsersItems(res, user._id, Dish);
});
