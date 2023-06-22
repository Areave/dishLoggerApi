import {Router, Request, Response} from 'express';
import {User, Product} from './../dataBase/models';
import {ObjectId} from "mongodb";

export const productRouter = Router({strict: true});

const createObjectId = (id: string) => {
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (error) {
        throw new Error();
    }
    return objectId;
};

const updateUserProducts = async (res, userId, products) => {
    try {
        // const user = await User.findOne({id: userId}).populate('products').exec();
        const updatedProducts = await Promise.all([User.updateOne({_id: userId}, {products}),
                                Product.find({owner: userId}).select('-owner')]);
        return res.status(201).json(updatedProducts[1]);
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
    const userProducts = await Product.find({owner: user._id});
    return res.status(200).json(userProducts);
});

// api/products/product/:id
productRouter.get('/product/:id', async (req: Request, res: Response): Promise<Response> => {
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
    const product = await Product.findOne({owner: user._id, _id: objectId});
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
    const candidate = await Product.findOne({name: product.name, owner: user._id});
    if (candidate) {
        return res.status(400).json({
            message: "Duplicate name: " + product.name
        });
    }
    product.owner = user._id;
    const newProduct = await Product.create({...product});
    const products = [...user.products, newProduct._id];
    return await updateUserProducts(res, user._id, products);
});

// api/products/update
productRouter.put('/update', async (req: Request, res: Response): Promise<Response> => {
    const {user, product} = req.body;
    product.owner = user._id;
    await Product.updateOne({_id: product._id}, {...product});
    const products = await Product.find({owner: user._id}).select('-owner');
    return res.status(201).json(products);
});

// api/products/remove
productRouter.delete('/remove', async (req: Request, res: Response): Promise<Response> => {
    const {user, productId} = req.body;
    let objectId;
    try {
        objectId = createObjectId(productId);
    } catch (error) {
        return res.status(400).json({
            message: 'Bad ID link',
            stack: error.stackTrace
        });
    }
    await Product.deleteOne({_id: objectId});
    const products = user.products.filter(product => {
        return product._id != productId;
    });
    return await updateUserProducts(res, user._id, products);
});

// api/products/remove_all
productRouter.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    await Product.deleteMany({owner: user._id});
    const products = [];
    return await updateUserProducts(res, user._id, products);
});
