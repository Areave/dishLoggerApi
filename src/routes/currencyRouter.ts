import {Router, Request, Response} from 'express';
import dotenv from 'dotenv'
import currenciesList from '../utils/currencies_list.json';
import axios from "axios";

dotenv.config();

export const currencyRouter = Router({strict: true});

// api/currency/get_currencies_list
currencyRouter.get('/get_currencies_list', async (req: Request, res: Response) => {
    res.status(200).json(currenciesList.response);
});
// api/currency/get_currencies_list_current
currencyRouter.get('/get_currencies_list_current', async (req: Request, res: Response) => {
    const key = process.env.currencybeaconApiKey;
    const apiUrl = process.env.currencybeaconApiUrl;
    const url = `${apiUrl}currencies?api_key=${key}`;

    try {
        const currenciesList = await axios.get(url);
        res.status(200).json(currenciesList.data);
    } catch (error) {
        console.log(error)
    }
});

// api/currency/get_exchange_rate?from=USD&to=UZS
currencyRouter.get('/get_exchange_rate', async (req: Request, res: Response) => {
    const key = process.env.currencybeaconApiKey;
    const apiUrl = process.env.currencybeaconApiUrl;
    const {from, to} = req.query;
    const url = `${apiUrl}convert?api_key=${key}&from=${from}&to=${to}&amount=1`;

    const response = {
        "meta": {"code": 200, "disclaimer": "Usage subject to terms: https:\/\/currencybeacon.com\/terms"},
        "response": {
            "timestamp": 1709100991,
            "date": "2024-02-28",
            "from": "USD",
            "to": "UZS",
            "amount": 1,
            "value": 12522.52227663
        },
        "timestamp": 1709100991,
        "date": "2024-02-28",
        "from": "USD",
        "to": "UZS",
        "amount": 1,
        "value": 12522.52227663
    }

    try {
        const rate = await axios.get(url);
        res.status(200).json(rate.data.response);
    } catch (error) {
        console.log(error)
    }
});