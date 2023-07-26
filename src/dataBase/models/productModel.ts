import {Schema, model, Types} from 'mongoose';
import {Double} from "mongodb";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: String,
    owner: {
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    },
    amountOfItems: {
        type: Number,
    },
    weightTotal: {
        type: Number,
    },
    price: {
        priceForOnePiece: Number,
        priceTotal: Number,
        priceFor100g: Number
    },
    energyValueFor100g: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
    energyValueForOneItem: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
});

export = model('Product', productSchema);