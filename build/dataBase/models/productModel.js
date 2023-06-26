"use strict";
var mongoose_1 = require("mongoose");
var productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: String,
    owner: {
        type: mongoose_1.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    weightOfPieceGr: {
        type: Number,
    },
    price: {
        priceForPiece: Number,
        priceFor100g: Number
    },
    energyValueFor100g: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
});
module.exports = (0, mongoose_1.model)('Product', productSchema);
