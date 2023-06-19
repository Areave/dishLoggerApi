"use strict";
var mongoose_1 = require("mongoose");
var wordSchema = new mongoose_1.Schema({
    word: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose_1.Types.ObjectId,
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
module.exports = (0, mongoose_1.model)('Word', wordSchema);
