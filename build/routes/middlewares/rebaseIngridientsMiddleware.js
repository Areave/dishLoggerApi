"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebaseIngridientsMiddleware = void 0;
var express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.rebaseIngridientsMiddleware = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var ingridients, ingridientsIds, ingridientsAmount;
    return __generator(this, function (_a) {
        console.log('req.body.dish', req.body.dish);
        if (!req.body.dish) {
            res.status(400).json({ message: "Dish is null" });
        }
        if (!req.body.dish.ingridients) {
            return [2 /*return*/, next()];
        }
        ingridients = req.body.dish.ingridients;
        ingridientsIds = {};
        ingridientsAmount = {};
        ingridients.forEach(function (ingridientObject) {
            var field;
            switch (ingridientObject.ingridient.type) {
                case 'dish':
                    field = 'dishes';
                    break;
                case 'product':
                    field = 'products';
                    break;
                default: field = 'products';
            }
            if (ingridientsIds[field]) {
                ingridientsIds[field].push(ingridientObject.ingridient._id);
            }
            else {
                ingridientsIds[field] = [ingridientObject.ingridient._id];
            }
            if (ingridientsAmount[field]) {
                ingridientsAmount[field].push(ingridientObject.amount);
            }
            else {
                ingridientsAmount[field] = [ingridientObject.amount];
            }
        });
        req.body.dish.ingridientsIds = ingridientsIds;
        req.body.dish.ingridientsAmount = ingridientsAmount;
        req.body.dish.owner = req.body.user._id;
        // delete req.body.dish.rawIngridients;
        console.log('req.body.dish', req.body.dish);
        next();
        return [2 /*return*/];
    });
}); });