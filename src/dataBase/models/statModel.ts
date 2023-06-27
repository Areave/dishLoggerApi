import {Schema, model, Types} from 'mongoose';

const statSchema = new Schema({
    dateTimestamp: {
        type: Number,
        required: true,
        unique: true
    },
    dateString: String,
    owner: {
        type: Types.ObjectId,
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

export = model('Stat', statSchema);