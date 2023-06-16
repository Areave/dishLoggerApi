import {Schema, model, Types} from 'mongoose';

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    id: {
      type: Number,
      required: true
    },
    description: {
        type: String,
    },
    ingredients: {
        type: Array,
        required: true
    },
    price: {
        type: Number
    },
    energyValue: {
        type: Object,
    },
});

export = model('Dish', dishSchema);