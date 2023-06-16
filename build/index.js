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
dotenv_1.default.config();
var mongoUri = process.env.mongoUri;
var port = process.env.PORT;
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// app.use('/users', usersRouter);
// app.use('/words', wordsRouter);
app.use('/api/auth', routes_1.authRouter);
app.use('/api/products', routes_1.productRouter);
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
//# sourceMappingURL=index.js.map