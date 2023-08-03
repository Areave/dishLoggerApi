import {Schema, model, Types} from 'mongoose';
import {Double} from "mongodb";

const productSchema = new Schema({
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
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    },
    weight: Number,
    price: Number,
    energyValue: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
    isThatPieceProduct: Boolean,
    amountOfPieces: Number,
    priceForAllPieces: Number,
    energyValueForOnePiece: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    },
});

export = model('Product', productSchema);