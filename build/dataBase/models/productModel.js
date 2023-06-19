"use strict";
var mongoose_1 = require("mongoose");
var productSchema = new mongoose_1.Schema({
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
    weightOfPieceGr: {
        type: Number,
    },
    price: {
        type: Object
    },
    energyValueFor100g: {
        type: Object,
    },
});
module.exports = (0, mongoose_1.model)('Product', productSchema);
