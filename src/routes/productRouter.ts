import {Router, Request, Response} from 'express';
import {Product} from './../dataBase/models';
import updateUsersItems from "../utils/updateUsersItems";
import {messageTypes} from "../utils/entitiesLists";
import {handleDataBaseError} from "../utils/handleDataBaseError";
import {ObjectId} from "bson";

export const productRouter = Router({strict: true});

// api/products/get_all
productRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        const userProducts = await Product.find({owner: user._id});
        return res.status(200).json(userProducts);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }

});

// api/products/product/:id
productRouter.get('/product/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    let objectId;
    try {
        objectId = new ObjectId(req.params.id);
    } catch (error) {
        return handleDataBaseError(error, 400, res);
    }
    try {
        const product = await Product.findOne({owner: user._id, _id: objectId});
        if (!product) {
            return res.status(400).json({
                message: {
                    type: messageTypes.ERROR,
                    text: 'No such product'
                }
            });
        }
        res.status(201).json(product);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/products/add
productRouter.post('/add', async (req: Request, res: Response): Promise<Response> => {
    const {user, product} = req.body;
    if (!product) {
        res.status(400).json({
            type: messageTypes.ERROR,
            text: "Product is null"})
    }
    try {
        const candidate = await Product.findOne({name: product.name, owner: user._id});
        if (candidate) {
            return res.status(400).json({
                type: messageTypes.ERROR,
                text: "Duplicate name: " + product.name
            });
        }
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }

    product.owner = user._id;
    const newProduct = await Product.create({...product});
    const products = [...user.products, newProduct._id];
    return await updateUsersItems(res, user._id, {products}, Product);
});

// api/products/update
productRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, product} = req.body;
    product.owner = user._id;
    try {
        await Product.updateOne({_id: product._id}, {...product});
        const products = await Product.find({owner: user._id}).select('-owner');
        return res.status(201).json(products);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/products/remove
productRouter.delete('/remove/:id', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        await Product.deleteOne({_id: req.params.id});
        const products = user.products.filter(product => {
            return product._id != req.params.id;
        });
        return await updateUsersItems(res, user._id, {products}, Product);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }

});

// api/products/remove_all
productRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        await Product.deleteMany({owner: user._id});
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
    const products = [];
    return await updateUsersItems(res, user._id, {products}, Product);
});
