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
    console.log(user)
    try {
        const userProducts = await Product.find({owner: user._id}).select('-owner');
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
    console.log('req.body', req.body);
    if (!product) {
        console.log('product', product);
        // res.status(400).json({
        //     type: messageTypes.ERROR,
        //     text: "Product is null"})
    }
    try {
        const candidate = await Product.findOne({name: product.name, owner: user._id});
        // console.log('candidate', candidate);
        if (candidate) {
            return res.status(400).json({
                type: messageTypes.ERROR,
                text: "Duplicate name: " + product.name
            });
        }
        product.owner = user._id;
        // console.log('product.owner',product.owner);
        const newProduct = await Product.create({...product});
        // console.log('newProduct',newProduct);
        // const userProducts = await Product.find({owner: user._id});
        // const products = [...user.products, newProduct._id];
        // console.log('products',products);
        return await updateUsersItems(res, user._id, Product);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }

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
        return await updateUsersItems(res, user._id, Product);
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
    return await updateUsersItems(res, user._id, Product);
});
