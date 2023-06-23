import asyncHandler from "express-async-handler";

export const rebaseIngridientsMiddleware = asyncHandler(async (req, res, next) => {

    // console.log('req.body.dish', req.body.dish);

    if (!req.body.dish) {
        res.status(400).json({message: "Dish is null"})
    }
    if (!req.body.dish.ingridients) {
        return next();
    }

    const ingridients: [{
        ingridient: {
            _id: string,
            type: string,
        },
        amount: number
    }] = req.body.dish.ingridients;

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

    req.body.dish.ingridientsIds = ingridientsIds;
    req.body.dish.ingridientsAmount = ingridientsAmount;
    req.body.dish.owner = req.body.user._id;
    next();
});