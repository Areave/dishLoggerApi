import {Schema, model, Types} from 'mongoose';

const mealSchema = new Schema({
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
    price: {
        type: Object
    },
    ingridientsIds: {
        products: [{
            type: Types.ObjectId,
            ref: 'Product'
        }],
        dishes: [{
            type: Types.ObjectId,
            ref: 'Dish'
        }],
    },
    ingridientsAmount: {
        products: Array,
        dishes: Array,
    },
    ingridients: Array,
    energyValue: {
        type: Object,
    },
});

export = model('Meal', mealSchema);