"use strict";
var mongoose_1 = require("mongoose");
var productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
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
