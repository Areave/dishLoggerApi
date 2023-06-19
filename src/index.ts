import express from 'express'
import dotenv from 'dotenv';
import pug from 'pug';
import cors from 'cors';
// import './index.pug';
import {dbConnect} from './dataBase/dbService';
import {userRouter, dishesRouter, productRouter} from "./routes";
import cookieParser from "cookie-parser";
import {protect} from "./routes/middlewares/authMiddleware";


dotenv.config();
const mongoUri = process.env.mongoUri;
const port = process.env.PORT;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
// app.use('/users', usersRouter);
// app.use('/words', wordsRouter);
app.use('/api/auth', userRouter);
app.use('/api/products', protect, productRouter);
app.use('/api/dishes', protect, dishesRouter);
// app.use('/api/auth/registration', (req, res) => {
//     res.send('auth endpoint');
// });
app.get('/', (req, res)=>{
    res.send('hey, its me');
});

// const compiledFunction = pug.compileFile('index.pug');

// app.get('/', (request, response) => {
//     response.send(pug.compileFile('./index.pug')({
//         name: 'joe'
//     }));
// });


const start = () => {
    try {
        dbConnect(mongoUri).then(()=> {
            app.listen(port, () => console.log(`Running on port ${port}`));
        });
    } catch (e) {
        console.log('database connected error', e.message);
        process.exit(1);
    }
};

start();

module.exports = app;