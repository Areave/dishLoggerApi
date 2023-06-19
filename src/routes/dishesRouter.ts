import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'

export const dishesRouter = Router({strict: true});

const updateUserDishes = async (res, userId, products) => {
    try {
        await User.updateOne({_id: userId}, {products});
        return res.status(201).json(products);
    } catch (error) {
        return res.status(500).json({
            message: "Database problems",
            stack: error.stackTrace
        });
    }
};

// api/dishes/get_all
dishesRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    return res.status(200).json(user.dishes);
});

// api/dishes/product/:id
dishesRouter.get('/dish/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const dish = user.dishes.find(dish => dish.id == req.params.id);
    if (!dish) {
        return res.status(400).json({
            message: "No such dish"
        });
    }
    res.status(201).json({dish});
});

// api/dishes/add
dishesRouter.post('/add', async (req: Request, res: Response): Promise<Response> => {
    const {user, dish} = req.body;
    if (!dish) {
        res.status(400).json({message: "Dish is null"})
    }
    const dishes = [...user.dishes, dish];
    return await updateUserDishes(res, user._id, dishes);
});

// api/dishes/update
dishesRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, dish} = req.body;
    const dishes = user.dishes.map(userDish => userDish.id == dish.id ? dish : userDish);
    return await updateUserDishes(res, user._id, dishes);
});

// api/dishes/remove
dishesRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
    const {user, dishId} = req.body;
    const dishes = user.dishes.filter(dish => {
        return dish.id != dishId;
    });
    return await updateUserDishes(res, user._id, dishes);
});

// api/dishes/remove_all
dishesRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const dishes = [];
    return await updateUserDishes(res, user._id, dishes);
});
