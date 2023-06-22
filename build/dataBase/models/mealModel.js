"use strict";
var mongoose_1 = require("mongoose");
var mealSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    dishes: [{
            type: mongoose_1.Types.ObjectId,
            ref: 'Dish'
        }],
    products: [{
            type: mongoose_1.Types.ObjectId,
            ref: 'Product'
        }],
    ingridients: {
        type: {
            dishes: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: 'Dish'
                }],
            products: [{
                    type: mongoose_1.Types.ObjectId,
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
module.exports = (0, mongoose_1.model)('Meal', mealSchema);
