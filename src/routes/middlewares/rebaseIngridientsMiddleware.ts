import asyncHandler from "express-async-handler";

export const rebaseIngridientsMiddleware = asyncHandler(async (req, res, next) => {

    // console.log('req.body.dish', req.body.dish);

    let key;
    if (req.body.dish) {
        key = 'dish';
    } else if (req.body.meal) {
        key = 'meal'
    } else {
        res.status(400).json({message: "No data was sended"})
    }

    if (!req.body[key].ingridients) {
        return next();
    }

    const ingridients: [{
        ingridient: {
            _id: string,
            type: string,
        },
        amount: number
    }] = req.body[key].ingridients;

    let ingridientsIds = {};
    let ingridientsAmount = {};

    ingridients.forEach( ingridientObject => {

        let field;


        switch (ingridientObject.ingridient.type) {
            case 'dish': field = 'dishes';
                break;
            case 'product': field = 'products';
                break;
            default : field = 'products';
        }

        if (ingridientsIds[field]) {
            ingridientsIds[field].push(ingridientObject.ingridient._id);
        } else {
            ingridientsIds[field] = [ingridientObject.ingridient._id];
        }

        if (ingridientsAmount[field]) {
            ingridientsAmount[field].push(ingridientObject.amount)
        } else {
            ingridientsAmount[field] = [ingridientObject.amount];
        }
    });

    req.body[key].ingridientsIds = ingridientsIds;
    req.body[key].ingridientsAmount = ingridientsAmount;
    req.body[key].owner = req.body.user._id;
    next();
});