import {Router, Request, Response} from 'express';
import {Dish, Meal, Product} from './../dataBase/models';
import updateUsersItems from "../utils/updateUsersItems";
import {itemsTypes, messageTypes} from "../utils/entitiesLists";
import {handleDataBaseError} from "../utils/handleDataBaseError";
import {ObjectId} from "bson";

export const getRouterForModel = (itemLabel: string) => {
    const router = Router({strict: true});

    let Model: any;
    switch (itemLabel) {
        case itemsTypes.PRODUCT:
            Model = Product;
            break;
        case itemsTypes.DISH:
            Model = Dish;
            break;
        case itemsTypes.MEAL:
            Model = Meal;
            break;
    }

    const getItemsByLabel = async (itemLabel, userId) => {
        let items: any[];
        if (itemLabel === itemsTypes.PRODUCT) {
            items = await Model.find({owner: userId}).select('-owner');
        } else {
            items = await Model.find({owner: userId}).select('-owner').populate({
                // TODO: может ли путь быть пустым? тогда все можно свести в одну строку
                path: 'ingridients.ingridient'
            });
        }
        return items;
    };

// api/{itemsLabel}/get_all
    router.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
        try {
            let items = await getItemsByLabel(itemLabel, req.body.user._id);
            return res.status(200).json(items);
        } catch (error) {
            return handleDataBaseError(error, 500, res);
        }
    });

// api/{itemsLabel}/{itemLabel}/:id
    router.get('/:itemLabel/:id', async (req: Request, res: Response): Promise<Response> => {
        const {user} = req.body;
        let objectId;
        try {
            objectId = new ObjectId(req.params.id);
        } catch (error) {
            return handleDataBaseError(error, 400, res);
        }
        try {
            const item = await Model.findOne({owner: user._id, _id: objectId});
            if (!item) {
                return res.status(400).json({
                    message: {
                        type: messageTypes.ERROR,
                        text: 'No such ' + itemLabel
                    }
                });
            }
            res.status(201).json(item);
        } catch (error) {
            return handleDataBaseError(error, 500, res);
        }
    });

// api/{itemLabel}/add
    router.post('/add', async (req: Request, res: Response): Promise<Response> => {
        const {user, item} = req.body;
        if (!item) {
            res.status(400).json({
                type: messageTypes.ERROR,
                text: itemLabel + " is null"
            })
        }
        try {
            const candidate = await Product.findOne({name: item.name, owner: user._id});
            if (candidate) {
                return res.status(400).json({
                    type: messageTypes.ERROR,
                    text: "Duplicate name: " + item.name
                });
            }
            item.owner = user._id;
            await Model.create({...item});
            const items = await getItemsByLabel(itemLabel, user);
            return res.status(200).json(items);
        } catch (error) {
            return handleDataBaseError(error, 500, res);
        }

    });

// api/{itemsLabel}/update
    router.put('/update', async (req: Request, res: Response): Promise<Response> => {
        const {user, item} = req.body;
        item.owner = user._id;
        try {
            await Model.updateOne({_id: item._id}, {...item});
            const items = await Model.find({owner: user._id}).select('-owner');
            return res.status(201).json(items);
        } catch (error) {
            return handleDataBaseError(error, 500, res);
        }
    });

// api/{itemsLabel}/remove
    router.delete('/remove/:id', async (req: Request, res: Response): Promise<Response> => {
        const {user} = req.body;
        try {
            // TODO: развести по разным try catch
            await Model.deleteOne({_id: req.params.id});
            let items = await getItemsByLabel(itemLabel, req.body.user);
            return res.status(200).json(items);
        } catch (error) {
            return handleDataBaseError(error, 500, res);
        }
    });

// api/{itemsLabel}/remove_all
    router.delete('/remove_all', async (req: Request, res: Response): Promise<Response> => {
        const {user} = req.body;
        try {
            // TODO: развести по разным try catch
            await Model.deleteMany({owner: user._id});
            let items = await getItemsByLabel(itemLabel, req.body.user);
            return res.status(200).json(items);
        } catch (error) {
            return handleDataBaseError(error, 500, res);
        }
    });

    return router;
};
