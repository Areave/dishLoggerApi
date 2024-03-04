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
    cookingCoefficient: Number,
    weight: Number,
    price: Number,
    energyValue: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
    isThatPieceItem: Boolean,
    amount: Number,
    priceForAllItems: Number,
    weightForAllItems: Number,
    energyValueForOneItem: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
    tags: [String]
}, {timestamps: true});

export = model('Product', productSchema);