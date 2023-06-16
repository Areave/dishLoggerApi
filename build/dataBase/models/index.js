"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dish = exports.Product = exports.Stats = exports.Word = exports.User = void 0;
var userModel_1 = __importDefault(require("./userModel"));
exports.User = userModel_1.default;
var wordModel_1 = __importDefault(require("./wordModel"));
exports.Word = wordModel_1.default;
var statsModel_1 = __importDefault(require("./statsModel"));
exports.Stats = statsModel_1.default;
var productModel_1 = __importDefault(require("./productModel"));
exports.Product = productModel_1.default;
var dishModel_1 = __importDefault(require("./dishModel"));
exports.Dish = dishModel_1.default;
//# sourceMappingURL=index.js.map