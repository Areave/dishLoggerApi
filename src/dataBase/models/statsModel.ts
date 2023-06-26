import {Schema, model, Types} from 'mongoose';

const statsSchema = new Schema({
    amountOfWords: {
        type: Number
    },
    amountOfAttempts: {
        type: Number
    },
    amountOfGuessings: {
        type: Number
    },
    amountOfNotGuessings: {
        type: Number
    },

    ratioOfGuessings: {
        type: Number
    },
    commonStatisticIndex: {
        type: Number
    },
    user: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

export = model('Stat', statsSchema);