"use strict";
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    name: {
        type: String
    },
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    intakeData: {
        type: Object
    },
    products: {
        type: Array,
    },
    meals: {
        type: Array,
    },
});
module.exports = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=userModel.js.map