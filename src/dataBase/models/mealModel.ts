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
    dishes: [{
        type: Types.ObjectId,
        ref: 'Dish'
    }],
    products: [{
        type: Types.ObjectId,
        ref: 'Product'
        }],
    ingridients: {
        type: {
            dishes: [{
                type: Types.ObjectId,
                ref: 'Dish'
            }],
            products: [{
                type: Types.ObjectId,
                ref: 'Product'
            }],
        }
    },
    price: {
        type: Object
    },
    energyValue: {
        type: Object,
    },
});

export = model('Meal', mealSchema);