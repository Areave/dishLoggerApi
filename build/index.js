"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
// import './index.pug';
var dbService_1 = require("./dataBase/dbService");
var routes_1 = require("./routes");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var authMiddleware_1 = require("./routes/middlewares/authMiddleware");
dotenv_1.default.config();
var mongoUri = process.env.mongoUri;
var port = process.env.PORT;
var app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use('/users', usersRouter);
// app.use('/words', wordsRouter);
app.use('/api/auth', routes_1.userRouter);
app.use('/api/products', authMiddleware_1.protect, routes_1.productRouter);
app.use('/api/dishes', authMiddleware_1.protect, routes_1.dishesRouter);
app.use('/api/meals', authMiddleware_1.protect, routes_1.mealsRouter);
// app.use('/api/auth/registration', (req, res) => {
//     res.send('auth endpoint');
// });
app.get('/', function (req, res) {
    res.send('hey, its me');
});
// const compiledFunction = pug.compileFile('index.pug');
// app.get('/', (request, response) => {
//     response.send(pug.compileFile('./index.pug')({
//         name: 'joe'
//     }));
// });
var start = function () {
    try {
        (0, dbService_1.dbConnect)(mongoUri).then(function () {
            app.listen(port, function () { return console.log("Running on port ".concat(port)); });
        });
    }
    catch (e) {
        console.log('database connected error', e.message);
        process.exit(1);
    }
};
start();
module.exports = app;
