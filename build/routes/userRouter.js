"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
var express_1 = require("express");
var userMiddleware_1 = require("./middlewares/userMiddleware");
exports.userRouter = (0, express_1.Router)({ strict: true });
// const setNewDataToField = async (user, fieldName: string, newValue, res) => {
//     try {
//         await User.updateOne({_id: user._id}, {fieldName: newValue});
//         return res.status(201).json(products);
//     } catch (error) {
//         // console.log('from productRouter', error.message);
//         return res.status(500).json({message: "Database problems"});
//     }
// };
// user/set_new_login
exports.userRouter.get('/registration', userMiddleware_1.userMiddleware, function (req, res) {
    throw new Error("Method not implemented.");
});
// user/set_new_password
exports.userRouter.post('/authentication', function (req, res) {
    throw new Error("Method not implemented.");
});
// user/set_new_name
exports.userRouter.patch('/login', function (req, res) {
    throw new Error("Method not implemented.");
});
// user/set_new_intake_data
exports.userRouter.patch('/login', function (req, res) {
    throw new Error("Method not implemented.");
});
//# sourceMappingURL=userRouter.js.map