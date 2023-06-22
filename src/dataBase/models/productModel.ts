import {Schema, model, Types} from 'mongoose';
import {Double} from "mongodb";

const productSchema = new Schema({
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
        type: Types.ObjectId,
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

export = model('Product', productSchema);