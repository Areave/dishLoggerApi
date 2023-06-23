import {Schema, model, Types} from 'mongoose';

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String
    },
    description: {
        type: String,
    },
    owner: {
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    },
    ingridientsIds: {
        products: [{
            type: Types.ObjectId,
            ref: 'Product'
        }]
    },
    ingridientsAmount: {
        products: Array
    },
    ingridients: Array,
    price: {
        type: Object
    },
    energyValue: {
        type: Object,
    },
});


// dishSchema.post('populate', function (doc, next){
//
//     console.log('postfind start, doc', doc);
//
//     doc.forEach( docItem => {
//
//         // @ts-ignore
//         const ingridientsIds = docItem.ingridientsIds;
//         // @ts-ignore
//         const ingridientsAmount = docItem.ingridientsAmount;
//         const ingridients = [];
//
//         ingridientsIds.products.forEach((ingridientObject, index) => {
//             ingridients.push({ingridient: ingridientObject, amount: ingridientsAmount.products[index]})
//         });
//
//         console.log('ingridients',ingridients);
//
//
//         docItem.ingridientsIds = '';
//         docItem.ingridientsAmount = '';
//         // @ts-ignore
//         docItem.ingridients = ingridients;
//
//         console.log("docItem", docItem);
//
//
//     });
//
//     console.log('postfind end, doc', doc);
//     next();
//
// });

export = model('Dish', dishSchema);