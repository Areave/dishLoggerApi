import {Schema, model, Types} from 'mongoose';
import {Double} from "mongodb";

const productSchema = new Schema({
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

export = model('Product', productSchema);