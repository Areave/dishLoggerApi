import {Schema, model, Types} from 'mongoose';

const wordSchema = new Schema({
    word: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    translation: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    countOfGuess: {
        type: Number,
        default: 0
    }
});

export = model('Word', wordSchema);