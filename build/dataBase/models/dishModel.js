"use strict";
var mongoose_1 = require("mongoose");
var dishSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
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
module.exports = (0, mongoose_1.model)('Dish', dishSchema);
