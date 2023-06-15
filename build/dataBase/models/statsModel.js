"use strict";
var mongoose_1 = require("mongoose");
var statsSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});
module.exports = (0, mongoose_1.model)('Stats', statsSchema);
//# sourceMappingURL=statsModel.js.map