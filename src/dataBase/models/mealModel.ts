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
}, {timestamps: true});

export = model('Meal', mealSchema);