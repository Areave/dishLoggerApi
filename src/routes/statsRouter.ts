import {Router, Request, Response} from 'express';
import {User, Stat} from './../dataBase/models';
import {rebaseIngridientsMiddleware} from "./middlewares/rebaseIngridientsMiddleware";
import generateObjectId from "../utils/generateObjectId";
import rebaseIngridients from "../utils/rebaseIngridients";

export const statsRouter = Router({strict: true});

// const updateUserDishes = async (res, userId, meals) => {
//     try {
//         const promiseAllArray = await Promise.all([
//             User.updateOne({_id: userId}, {meals}),
//             Meal.find({owner: userId}).populate('ingridientsIds.products').populate('ingridientsIds.dishes')
//         ]);
//         const updatedDishesArray = rebaseIngridients(promiseAllArray[1]);
//         return res.status(201).json(updatedDishesArray);
//
//     } catch (error) {
//         return res.status(500).json({
//             message: "Database problems",
//             stack: error.message
//         });
//     }
// };

// api/stats/add
statsRouter.post('/set', rebaseIngridientsMiddleware, async (req: Request, res: Response): Promise<Response> => {
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

// api/stats/get_stat
statsRouter.post('/meal/:id', async (req: Request, res: Response): Promise<Response> => {
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

