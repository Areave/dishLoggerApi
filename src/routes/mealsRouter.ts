import {Router, Request, Response} from 'express';
import {Meal} from './../dataBase/models';
import generateObjectId from "../utils/generateObjectId";
import updateUsersItems from "../utils/updateUsersItems";

export const mealsRouter = Router({strict: true});

// api/meals/add
mealsRouter.post('/add', async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    if (await Meal.exists({name: meal.name, owner: user._id})) {
        return res.status(400).json({
            message: "Duplicate name: " + meal.name
        });
    }
    meal.owner = user._id;
    const date = new Date();
    meal.dateString = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
    const newItem = await Meal.create({...meal});
    const meals = [...user.meals, newItem._id];
    return await updateUsersItems(res, user._id, {meals}, Meal);
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
    let meal = await Meal.findOne({owner: user._id, _id: objectId}).select('-owner');
    if (!meal) {
        return res.status(400).json({
            message: "No such meal"
        });
    }
    res.status(201).json(meal);
});

// api/meals/get_all
mealsRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const userDishes = await Meal.find({owner: user._id}).select('-owner');
    return res.status(200).json(userDishes);
});

// api/meals/update
mealsRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    await Meal.updateOne({_id: meal._id}, {...meal});
    const dishes = await Meal.find({owner: user._id}).select('-owner');
    return res.status(201).json(dishes);
});

// api/meals/remove
mealsRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
    const {user, mealId} = req.body;
    await Meal.deleteOne({_id: mealId});
    const meals = user.meals.filter(meal => {
        return meal._id != mealId;
    });
    return await updateUsersItems(res, user._id, {meals}, Meal);
});

// api/meals/remove_all
mealsRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    await Meal.deleteMany({owner: user._id});
    const meals = [];
    return await updateUsersItems(res, user._id, {meals}, Meal);
});
