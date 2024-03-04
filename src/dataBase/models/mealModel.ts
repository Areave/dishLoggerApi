import {Schema, model, Types} from 'mongoose';

import {returnModelByType} from "../../utils/returnModelByType";

const mealSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    description: String,
    owner: {
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    },
    dateString: String,
    ingridients: [
        {
            ingridient: {
                type: Types.ObjectId,
                require: true,
                ref: returnModelByType
            },
            type: {
                type: String,
                required: true
            },
            weight: Number,
            amount: Number,
            price: Number,
            weightForTakenAmount: Number,
            energyValue: {
                calories: Number,
                proteines: Number,
                fats: Number,
                carbohydrates: Number
            }
        }
    ],
    weight: Number,
    price: Number,
    priceUSD: Number,
    energyValue: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
}, {timestamps: true});

export = model('Meal', mealSchema);