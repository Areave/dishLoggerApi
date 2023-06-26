import {Schema, model, Types} from 'mongoose';

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
    ingridients: [{
        ingridient: Object,
        weight: Number,
        price: Number,
        energyValue: {
            calories: Number,
            proteines: Number,
            fats: Number,
            carbohydrates: Number
        }
    }],
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