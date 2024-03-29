import {Router, Request, Response} from 'express';
import {Dish, Meal} from './../dataBase/models';
import updateUsersItems from "../utils/updateUsersItems";
import {handleDataBaseError} from "../utils/handleDataBaseError";
import {ObjectId} from "bson";
import {types} from "util";
import {messageTypes} from "../utils/entitiesLists";
import {getDateStringFromRawDate} from "../utils/dateConverter";
import {rebaseIngridients} from "../utils/rebaseIngridients";

export const mealsRouter = Router({strict: true});

// api/meals/add
mealsRouter.post('/add', async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    try {
        const candidate = await Meal.exists({name: meal.name, owner: user._id})
        if (candidate) {
            return res.status(400).json({
                type: messageTypes.ERROR,
                text: "Duplicate name: " + meal.name
            });
        }
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
    meal.owner = user._id;
    try {
        meal.date = new Date();
        // Слабое место, нужно продолжать после успешного создания
        await Meal.create(meal);
        const meals = await Meal.find({owner: user._id}).select('-owner').populate({
            path:'ingridients.ingridient',
        });
        return res.status(201).json(meals);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/meals/meal/:id
mealsRouter.get('/meal/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    let objectId;
    try {
        objectId = new ObjectId(req.params.id);
    } catch (error) {
        return handleDataBaseError(error, 400, res);
    }
    try {
        let meal = await Meal.findOne({owner: user._id, _id: objectId}).select('-owner').populate('ingridientsIds');
        if (!meal) {
            return res.status(400).json({
                type: messageTypes.ERROR,
                text: "No such meal"
            });
        }
        const mealWithIngridients = rebaseIngridients([meal])[0];
        // console.log('meal before rebase ingridients', meal);
        // meal = (rebaseIngridients([meal]))[0];
        // console.log('meal after rebase ingridients', meal);
        res.status(201).json(mealWithIngridients);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/meals/get_all
mealsRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        const userMeals = await Meal.find({owner: user._id}).select('-owner').populate('ingridients.ingridient');
        return res.status(200).json(userMeals);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/meals/update
mealsRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    await Meal.updateOne({_id: meal._id}, {...meal});
    try {
        const meals = await Meal.find({owner: user._id}).select('-owner').populate('ingridients.ingridient');
        return res.status(201).json(meals);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/meals/remove
mealsRouter.delete('/remove/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        await Meal.deleteOne({_id: req.params.id});
        // const meals = user.meals.filter(meal => {
        //     return meal._id != req.params.id;
        // });
        return await updateUsersItems(res, user._id, Meal);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/meals/remove_all
mealsRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        await Meal.deleteMany({owner: user._id});
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
    const meals = [];
    return await updateUsersItems(res, user._id, Meal);
});
