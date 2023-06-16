import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'
import {userMiddleware} from "./middlewares/userMiddleware";

export const productRouter = Router({strict: true});

const updateUserProducts = async (userId, products) => {
    await User.updateOne({_id: userId}, {products});
};

const tryCatch = async (res, userId, products) => {
    try {
        await updateUserProducts(userId, products);
        return res.status(201).json(products);
    } catch (error) {
        // console.log('from productRouter', error.message);
        return res.status(500).json({message: "Database problems"});
    }
};

// api/products/get_all
productRouter.post('/get_all', userMiddleware, async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    return res.status(200).json(user.products);
});

// api/products/:id
productRouter.post('/product/:id', userMiddleware, async (req: Request, res: Response): Promise<Response> => {
    console.log('req.params.id', req.params.id);
    const {user} = req.body;
    const product = user.products.find(product => product.id == req.params.id);
    return res.status(201).json({product});
});

// api/products/add
productRouter.post('/add', userMiddleware, async (req: Request, res: Response): Promise<Response> => {
    console.log('router');
    const {user, product} = req.body;
    // console.log('req.body router', req.body);
    if (!product) {
        res.status(400).json({message: "Product is null"})
    }
    const products = [...user.products, product];
    console.log(products);
    return await tryCatch(res, user._id, products);
});

// api/products/update
productRouter.post('/update', userMiddleware, async (req: Request, res: Response): Promise<Response> => {
    const {user, product} = req.body;
    const products = user.products.map(userProduct => userProduct.id == product.id ? product : userProduct);
    return await tryCatch(res, user._id, products);
});

// api/products/remove
productRouter.post('/remove', userMiddleware, async (req: Request, res: Response): Promise<Response> => {
    const {user, productId} = req.body;
    const products = user.products.filter(product => {
        return product.id != productId;
    });
    return await tryCatch(res, user._id, products);
});

// api/products/remove
productRouter.post('/remove_all', userMiddleware, async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const products = [];
    return await tryCatch(res, user._id, products);
});
