import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'

export const mealsRouter = Router({strict: true});

const updateUserMeals = async (res, userId, meals) => {
    try {
        await User.updateOne({_id: userId}, {meals});
        return res.status(201).json(meals);
    } catch (error) {
        return res.status(500).json({
            message: "Database problems",
            stack: error.stackTrace
        });
    }
};

// api/meals/get_all
mealsRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    return res.status(200).json(user.meals);
});

// api/meals/product/:id
mealsRouter.get('/meal/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const meal = user.meals.find(meal => meal.id == req.params.id);
    if (!meal) {
        return res.status(400).json({
            message: "No such meal"
        });
    }
    res.status(201).json(meal);
});

// api/meals/add
mealsRouter.post('/add', async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    if (!meal) {
        res.status(400).json({message: "meal is null"})
    }
    const meals = [...user.meals, meal];
    return await updateUserMeals(res, user._id, meals);
});

// api/meals/update
mealsRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    const meals = user.meals.map(userDish => userDish.id == meal.id ? meal : userDish);
    return await updateUserMeals(res, user._id, meals);
});

// api/meals/remove
mealsRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
    const {user, mealId} = req.body;
    const meals = user.meals.filter(meal => {
        return meal.id != mealId;
    });
    return await updateUserMeals(res, user._id, meals);
});

// api/meals/remove_all
mealsRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const meals = [];
    return await updateUserMeals(res, user._id, meals);
});
