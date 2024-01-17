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
            weight: Number,
            amount: Number,
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
    }
});

export = model('Dish', dishSchema);