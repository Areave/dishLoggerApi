"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authMiddleware = exports.protect = void 0;
var jwt = __importStar(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var models_1 = require("../../dataBase/models");
dotenv_1.default.config();
exports.protect = (0, express_async_handler_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var rawToken, decoded, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                rawToken = req.cookies.jwt;
                if (!rawToken) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                decoded = jwt.verify(rawToken, process.env.jwtKey);
                // @ts-ignore
                _a = req.body;
                return [4 /*yield*/, models_1.User.findById(decoded.userId).select('-password')];
            case 2:
                // @ts-ignore
                _a.user = _b.sent();
                next();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(401);
                throw new Error('Not authorized, invalid token');
            case 4: return [3 /*break*/, 6];
            case 5:
                // res.status(401).json({message: 'no token'});
                res.status(401);
                throw new Error('Not authorized, no token');
            case 6: return [2 /*return*/];
        }
    });
}); });
var authMiddleware = function (request, response, next) {
    try {
        if (request.method === 'OPTIONS') {
            return next();
        }
        console.log('request.headers', request.headers);
        var token = request.headers.authorization.split(' ')[1];
        if (!token) {
            console.log('error token');
            // return response.status(401).json({message: 'not authorized user from mw'});
            throw new Error('authorization token wasn\'t sended');
        }
        var jwtKey = process.env.jwtKey;
        var data = void 0;
        try {
            data = jwt.verify(token, jwtKey);
        }
        catch (e) {
            throw new Error('authorization token is expired');
        }
        request.body.telegramNickname = data.telegramNickname;
        next();
    }
    catch (e) {
        console.log('from middleware, error', e);
        // throw new Error(e.message);
        return response.status(401).json({ message: e.message });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map