"use strict";
var mongoose_1 = require("mongoose");
var statSchema = new mongoose_1.Schema({
    dateTimestamp: {
        type: Number,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose_1.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    price: Number,
    ingridientsIds: {
        products: [{
                type: mongoose_1.Types.ObjectId,
                ref: 'Product'
            }],
        dishes: [{
                type: mongoose_1.Types.ObjectId,
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
module.exports = (0, mongoose_1.model)('Stat', statSchema);
