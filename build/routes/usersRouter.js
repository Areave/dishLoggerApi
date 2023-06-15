"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
var express_1 = require("express");
exports.usersRouter = (0, express_1.Router)({ strict: true });
// users/registration
exports.usersRouter.get('/registration', function (req, res) {
    throw new Error("Method not implemented.");
});
// users/authentication
exports.usersRouter.post('/authentication', function (req, res) {
    throw new Error("Method not implemented.");
});
// users/login
exports.usersRouter.patch('/login', function (req, res) {
    throw new Error("Method not implemented.");
});
//# sourceMappingURL=usersRouter.js.map