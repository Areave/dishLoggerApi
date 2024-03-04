import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import {dbConnect} from './dataBase/dbService';
import {usersRouter, productRouter, dishesRouter, mealsRouter, statsRouter, currencyRouter} from "./routes";
import cookieParser from "cookie-parser";
import {verifyUser} from "./routes/middlewares/verifyUserMiddleware";
import swaggerUi from 'swagger-ui-express';
import * as swaggerUiDocument from './utils/openApi.json';
import {Dish} from './dataBase/models';
import {getRouterForModel} from "./routes/commonRouter";

dotenv.config();
const mongoUri = process.env.mongoUri;
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors({credentials: true, origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:4000', 'http://localhost:4000']}));
app.use(cookieParser());

app.use(express.urlencoded({extended: true}));

// app.use('/api/products', verifyUser, getRouterForModel('product'));
// app.use('/api/products', verifyUser, getRouterForModel('dish'));
// app.use('/api/products', verifyUser, getRouterForModel('meal'));
app.use('/api/users', usersRouter);
app.use('/api/currency', verifyUser, currencyRouter);
app.use('/api/stats', verifyUser, statsRouter);
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerUiDocument));
app.use('/api/products', verifyUser, productRouter);
app.use('/api/dishes', verifyUser, dishesRouter);
app.use('/api/meals', verifyUser, mealsRouter);


app.get('/', (req, res) => {
    res.send('hey, its me');
});

const start = async () => {
    console.log(JSON.stringify(Dish));
    try {
        await dbConnect(mongoUri)
        app.listen(port, () => console.log(`Running on port ${port}`));
    } catch (e) {
        console.log('database connected error', e.message);
        process.exit(1);
    }
};

start();

module.exports = app;