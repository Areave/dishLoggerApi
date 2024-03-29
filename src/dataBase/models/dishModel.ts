import {Schema, model, Types} from 'mongoose';
import {returnModelByType} from "../../utils/returnModelByType";

const dishSchema = new Schema({
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
            weightTaken: Number,
            weight: Number,
            amount: Number,
            weightForTakenAmount: Number,
            price: Number,
            energyValue: {
                calories: Number,
                proteines: Number,
                fats: Number,
                carbohydrates: Number
            }
        }
    ],
    isThatPieceItem: Boolean,
    weight: Number,
    price: Number,
    energyValue: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
    tags: [String]
}, {timestamps: true});

export = model('Dish', dishSchema);