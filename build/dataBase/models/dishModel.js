"use strict";
var mongoose_1 = require("mongoose");
var dishSchema = new mongoose_1.Schema({
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
module.exports = (0, mongoose_1.model)('Dish', dishSchema);
//# sourceMappingURL=dishModel.js.map