import {Router, Request, Response} from 'express';
import {User} from './../dataBase/models'

export const productRouter = Router({strict: true});

const updateUserProducts = async (res, userId, products) => {
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

// api/products/get_all
productRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    return res.status(200).json(user.products);
});

// api/products/product/:id
productRouter.get('/product/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const product = user.products.find(product => product.id == req.params.id);
    if (!product) {
        return res.status(400).json({
            message: "No such product"
        });
    }
    res.status(201).json(product);
});

// api/products/add
productRouter.post('/add', async (req: Request, res: Response): Promise<Response> => {
    const {user, product} = req.body;
    if (!product) {
        res.status(400).json({message: "Product is null"})
    }
    const products = [...user.products, product];
    return await updateUserProducts(res, user._id, products);
});

// api/products/update
productRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, product} = req.body;
    const products = user.products.map(userProduct => userProduct.id == product.id ? product : userProduct);
    return await updateUserProducts(res, user._id, products);
});

// api/products/remove
productRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
    const {user, productId} = req.body;
    const products = user.products.filter(product => {
        return product.id != productId;
    });
    return await updateUserProducts(res, user._id, products);
});

// api/products/remove_all
productRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    const products = [];
    return await updateUserProducts(res, user._id, products);
});
