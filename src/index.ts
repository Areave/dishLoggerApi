import express from 'express'
import dotenv from 'dotenv';
import pug from 'pug';
import cors from 'cors';
import {dbConnect} from './dataBase/dbService';
import {usersRouter, wordsRouter, authRouter} from "./routes";


dotenv.config();
const mongoUri = process.env.mongoUri;
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/users', usersRouter);
app.use('/words', wordsRouter);
app.use('/auth', authRouter);

// const compiledFunction = pug.compileFile('index.pug');

// app.get('/', (request, response) => {
//     response.send(pug.compileFile('index.pug')({
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