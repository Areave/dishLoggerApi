import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import {dbConnect} from './dataBase/dbService';
import {usersRouter, productRouter, dishesRouter, mealsRouter, statsRouter} from "./routes";
import cookieParser from "cookie-parser";
import {verifyUser} from "./routes/middlewares/authMiddleware";


dotenv.config();
const mongoUri = process.env.mongoUri;
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors({credentials: true, origin: ['http://localhost:3000', 'http://127.0.0.1:3000']}));
app.use(cookieParser());

app.use(express.urlencoded({extended: true}));
app.use('/api/users', usersRouter);
app.use('/api/products', verifyUser, productRouter);
app.use('/api/dishes', verifyUser, dishesRouter);
app.use('/api/meals', verifyUser, mealsRouter);
app.use('/api/stats', verifyUser, statsRouter);

app.get('/', (req, res)=>{
    res.send('hey, its me');
});

const start = async () => {
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