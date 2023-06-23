import {Router, Request, Response} from 'express';
import {User, Dish} from './../dataBase/models';
import {rebaseIngridientsMiddleware} from "./middlewares/rebaseIngridientsMiddleware";
import generateObjectId from "../utils/generateObjectId";
import rebaseIngridients from "../utils/rebaseIngridients";

export const dishesRouter = Router({strict: true});

const updateUserDishes = async (res, userId, dishes) => {
    try {
        const promiseAllArray = await Promise.all([
            User.updateOne({_id: userId}, {dishes}),
            Dish.find({owner: userId}).populate('ingridientsIds.products')
        ]);
        const updatedDishesArray = rebaseIngridients(promiseAllArray[1]);
        return res.status(201).json(updatedDishesArray);

    } catch (error) {
        return res.status(500).json({
            message: "Database problems",
            stack: error.message
        });
    }
};

// api/dishes/add
dishesRouter.post('/add', rebaseIngridientsMiddleware, async (req: Request, res: Response): Promise<Response> => {
    const {user, dish} = req.body;
    if (await Dish.exists({name: dish.name, owner: user._id})) {
        return res.status(400).json({
            message: "Duplicate name: " + dish.name
        });
    }
    const newItem = await Dish.create({...dish});
    const dishes = [...user.dishes, newItem._id];
    return await updateUserDishes(res, user._id, dishes);
});

// api/dishes/dish/:id
dishesRouter.get('/dish/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    let objectId;
    try {
        objectId = generateObjectId(req.params.id);
    } catch (error) {
        return res.status(400).json({
            message: 'Bad ID link',
            stack: error.stackTrace
        });
    }
    let dish = await Dish.findOne({owner: user._id, _id: objectId}).populate('ingridientsIds.products');
    if (!dish) {
        return res.status(400).json({
            message: "No such dish"
        });
    }
    dish = rebaseIngridients([dish])[0];
    res.status(201).json(dish);
});

// api/dishes/get_all
dishesRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const userDishes = await Dish.find({owner: user._id});
    return res.status(200).json(userDishes);
});

// api/dishes/update
dishesRouter.put('/update', rebaseIngridientsMiddleware, async (req: Request, res: Response): Promise<Response> => {
    const {user, dish} = req.body;
    dish.owner = user._id;
    await Dish.updateOne({_id: dish._id}, {...dish});
    const dishes = await Dish.find({owner: user._id}).select('-owner');
    return res.status(201).json(dishes);
});

// api/dishes/remove
dishesRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
    const {user, dishId} = req.body;
    let objectId;
    try {
        objectId = generateObjectId(dishId);
    } catch (error) {
        return res.status(400).json({
            message: 'Bad ID link',
            stack: error.stackTrace
        });
    }
    await Dish.deleteOne({_id: objectId});
    const dishes = user.dishes.filter(dish => {
        return dish._id != dishId;
    });
    return await updateUserDishes(res, user._id, dishes);
});

// api/dishes/remove_all
dishesRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    await Dish.deleteMany({owner: user._id});
    const dishes = [];
    return await updateUserDishes(res, user._id, dishes);
});
