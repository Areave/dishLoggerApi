"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInstance = exports.dbConnect = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var dbConnect = function (uri) {
    try {
        return mongoose_1.default.connect(uri);
    }
    catch (error) {
        console.log('database connected error', error.message);
        process.exit(1);
    }
};
exports.dbConnect = dbConnect;
var addInstance = function (Schema, params) {
    var instance = new Schema(params);
    return instance.save();
};
exports.addInstance = addInstance;
