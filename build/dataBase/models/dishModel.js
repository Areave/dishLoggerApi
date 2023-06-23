"use strict";
var mongoose_1 = require("mongoose");
var dishSchema = new mongoose_1.Schema({
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
    price: {
        type: Object
    },
    ingridientsIds: {
        products: [{
                type: mongoose_1.Types.ObjectId,
                ref: 'Product'
            }]
    },
    ingridientsAmount: {
        products: Array
    },
    ingridients: Array,
    energyValue: {
        type: Object,
    },
});
module.exports = (0, mongoose_1.model)('Dish', dishSchema);
