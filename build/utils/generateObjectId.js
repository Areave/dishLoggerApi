"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var generateObjectId = function (id) {
    var objectId;
    try {
        objectId = new bson_1.ObjectId(id);
    }
    catch (error) {
        throw new Error();
    }
    return objectId;
};
exports.default = generateObjectId;
