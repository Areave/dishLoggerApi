import {Router, Request, Response} from 'express';
import {User, Meal} from './../dataBase/models';
import {ObjectId} from "mongodb";

export const mealsRouter = Router({strict: true});

const createObjectId = (id: string) => {
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (error) {
        throw new Error();
    }
    return objectId;
};

const updateUserMeals = async (res, userId, meals) => {
    try {
        // const user = await User.findOne({id: userId}).populate('meals').exec();
        const updatedMeals = await Promise.all([User.updateOne({_id: userId}, {meals}),
            Meal.find({owner: userId})
            // .populate('ingridients')
            //     .populate({
            //         path: 'dishes',
            //         populate: { path: 'products' }})
                .populate({
                    path: 'ingridients',
                    populate: { path: 'products' }})
                .populate({
                    path: 'ingridients',
                    populate: { path: 'dishes' }})
                // .populate('ingridients')
                // .populate('ingridients.dishes')
                .select('-owner')]);
        return res.status(201).json(updatedMeals[1]);
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
    const userMeals = await Meal.find({owner: user._id}).populate('dishes').populate('products');
    return res.status(200).json(userMeals);
});

// api/meals/meal/:id
mealsRouter.get('/meal/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    let objectId;
    try {
        objectId = createObjectId(req.params.id);
    } catch (error) {
        return res.status(400).json({
            message: 'Bad ID link',
            stack: error.stackTrace
        });
    }
    const meal = await Meal.findOne({owner: user._id, _id: objectId}).populate({
        path: 'ingridients', populate: [
            {
                path: 'dishes',
                select: 'name',
            },
        ]
    });
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
        res.status(400).json({message: "Meal is null"})
    }
    meal.owner = user._id;
    const candidate = await Meal.findOne({name: meal.name, owner: user._id});
    if (candidate) {
        return res.status(400).json({
            message: "Duplicate name: " + meal.name
        });
    }
    const newItem = await Meal.create({...meal});
    const meals = [...user.meals, newItem._id];
    return await updateUserMeals(res, user._id, meals);
});

// api/meals/update
mealsRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, meal} = req.body;
    meal.owner = user._id;
    await Meal.updateOne({_id: meal._id}, {...meal});
    const meals = await Meal.find({owner: user._id}).populate('products').select('-owner');
    return res.status(201).json(meals);
});

// api/meals/remove
mealsRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
    const {user, mealId} = req.body;
    let objectId;
    try {
        objectId = createObjectId(mealId);
    } catch (error) {
        return res.status(400).json({
            message: 'Bad ID link',
            stack: error.stackTrace
        });
    }
    await Meal.deleteOne({_id: objectId});
    const meals = user.meals.filter(meal => {
        return meal._id != mealId;
    });
    return await updateUserMeals(res, user._id, meals);
});

// api/meals/remove_all
mealsRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    await Meal.deleteMany({owner: user._id});
    const meals = [];
    return await updateUserMeals(res, user._id, meals);
});
