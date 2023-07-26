import {Router, Request, Response} from 'express';
import {Dish} from './../dataBase/models';
import updateUsersItems from "../utils/updateUsersItems";
import {handleDataBaseError} from "../utils/handleDataBaseError";
import {ObjectId} from "bson";

export const dishesRouter = Router({strict: true});

// api/dishes/add
dishesRouter.post('/add', async (req: Request, res: Response): Promise<Response> => {
    const {user, dish} = req.body;
    if (await Dish.exists({name: dish.name, owner: user._id})) {
        return res.status(400).json({
            message: {
                type: 'error',
                text: "Duplicate name: " + dish.name
            }
        });
    }
    dish.owner = user._id;
    const newItem = await Dish.create({...dish});
    const dishes = [...user.dishes, newItem._id];
    return await updateUsersItems(res, user._id, {dishes}, Dish);
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
        let dish = await Dish.findOne({owner: user._id, _id: objectId}).select('-owner');
        if (!dish) {
            return res.status(400).json({
                message: {
                    type: "error",
                    text: "No such dish"
                }
            });
        }
        res.status(201).json(dish);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/dishes/get_all
dishesRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const userDishes = await Dish.find({owner: user._id}).select('-owner');
    return res.status(200).json(userDishes);
});

// api/dishes/update
dishesRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, dish} = req.body;
    await Dish.updateOne({_id: dish._id}, {...dish});
    const dishes = await Dish.find({owner: user._id}).select('-owner');
    return res.status(201).json(dishes);
});

// api/dishes/remove
dishesRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
    const {user, dishId} = req.body;
    await Dish.deleteOne({_id: dishId});
    const dishes = user.dishes.filter(dish => {
        return dish._id != dishId;
    });
    return await updateUsersItems(res, user._id, {dishes}, Dish);
});

// api/dishes/remove_all
dishesRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    await Dish.deleteMany({owner: user._id});
    const dishes = [];
    return await updateUsersItems(res, user._id, {dishes}, Dish);
});
