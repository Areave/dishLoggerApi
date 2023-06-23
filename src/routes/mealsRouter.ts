import {Router, Request, Response} from 'express';
import {User, Meal} from './../dataBase/models';
import {rebaseIngridientsMiddleware} from "./middlewares/rebaseIngridientsMiddleware";
import generateObjectId from "../utils/generateObjectId";
import rebaseIngridients from "../utils/rebaseIngridients";

export const mealsRouter = Router({strict: true});

const updateUserDishes = async (res, userId, meals) => {
    try {
        const promiseAllArray = await Promise.all([
            User.updateOne({_id: userId}, {meals}),
            Meal.find({owner: userId}).populate('ingridientsIds.products').populate('ingridientsIds.dishes')
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

// api/meals/add
mealsRouter.post('/add', rebaseIngridientsMiddleware, async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    if (await Meal.exists({name: meal.name, owner: user._id})) {
        return res.status(400).json({
            message: "Duplicate name: " + meal.name
        });
    }
    const newItem = await Meal.create({...meal});
    const meals = [...user.meals, newItem._id];
    return await updateUserDishes(res, user._id, meals);
});

// api/meals/meal/:id
mealsRouter.get('/meal/:id', async (req: Request, res: Response): Promise<Response> => {
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
    let meal = await Meal.findOne({owner: user._id, _id: objectId}).populate('ingridientsIds.products').populate('ingridientsIds.dishes');
    if (!meal) {
        return res.status(400).json({
            message: "No such meal"
        });
    }
    meal = rebaseIngridients([meal])[0];
    res.status(201).json(meal);
});

// api/meals/get_all
mealsRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const userDishes = await Meal.find({owner: user._id});
    return res.status(200).json(userDishes);
});

// api/meals/update
mealsRouter.put('/update', rebaseIngridientsMiddleware, async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    meal.owner = user._id;
    await Meal.updateOne({_id: meal._id}, {...meal});
    const meals = await Meal.find({owner: user._id}).select('-owner');
    return res.status(201).json(meals);
});

// api/meals/remove
mealsRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
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
    await Meal.deleteOne({_id: objectId});
    const meals = user.meals.filter(meal => {
        return meal._id != dishId;
    });
    return await updateUserDishes(res, user._id, meals);
});

// api/meals/remove_all
mealsRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    await Meal.deleteMany({owner: user._id});
    const meals = [];
    return await updateUserDishes(res, user._id, meals);
});
