import {Router, Request, Response} from 'express';
import {Dish} from './../dataBase/models';
import generateObjectId from "../utils/generateObjectId";
import updateUsersItems from "../utils/updateUsersItems";

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
        objectId = generateObjectId(req.params.id);
    } catch (error) {
        return res.status(400).json({
            message: {
                type: 'error',
                text: "Bad ID link"
            },
            stack: error.stackTrace
        });
    }
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
