import {Schema, model, Types} from 'mongoose';

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
    ingridientsIds: [{
        type: Types.ObjectId,
        require: true,
        ref: 'Product' || 'Dish'
    }],
    ingridientsAmount: [{
        weight: Number,
        amountOfItems: Number,
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
}, {timestamps: true});

export = model('Meal', mealSchema);