import {Schema, model, Types} from 'mongoose';

const statSchema = new Schema({
    dateTimestamp: {
        type: Number,
        required: true,
        unique: true
    },
    owner: {
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    },
    price: Number,
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

export = model('Stat', statSchema);