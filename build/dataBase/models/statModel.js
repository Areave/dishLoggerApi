"use strict";
var mongoose_1 = require("mongoose");
var statSchema = new mongoose_1.Schema({
    dateTimestamp: {
        type: Number,
        required: true,
        unique: true
    },
    dateString: String,
    owner: {
        type: mongoose_1.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    meals: Array,
    weight: Number,
    price: Number,
    energyValue: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
    energyValueDifference: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    }
});
module.exports = (0, mongoose_1.model)('Stat', statSchema);
