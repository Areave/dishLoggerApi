"use strict";
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    telegramNickname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    words: [{
            type: mongoose_1.Types.ObjectId,
            ref: 'Word'
        }],
    stats: {
        type: mongoose_1.Types.ObjectId,
        ref: "Stats"
    }
});
module.exports = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=userModel.js.map