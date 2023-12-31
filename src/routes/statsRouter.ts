import {Router, Request, Response} from 'express';
import {Meal} from './../dataBase/models';
import {handleDataBaseError} from "../utils/handleDataBaseError";
import {getDateStringFromJSONStringDate} from "../utils/dateConverter";

export const statsRouter = Router({strict: true});

interface Meal {
    dateString: string,
    _id: string,
    name: string,
    weight: number,
    price: number,
    energyValue: {
        calories: number,
        proteines: number,
        fats: number,
        carbohydrates: number
    }
}

const getStatDifferences = (intakeData, stat) => {

    if (!intakeData || !intakeData.energyValue || Object.keys(intakeData.energyValue).length === 0) {
        return {};
    }

    const energyValueDifference = {
        calories: 0,
        proteines: 0,
        fats: 0,
        carbohydrates: 0
    };

    for (let key in energyValueDifference) {
        // console.log('key', key)
        if (stat[key] && intakeData.energyValue[key]) {
            energyValueDifference[key] = ((stat[key] / intakeData.energyValue[key]) * 100).toFixed(0);
        }

    }
    return energyValueDifference;
};

const mergeMealDataToMainStat = (meal, mainStat) => {
    const newMainStat = {
        weight: 0,
        price: 0,
        energyValue: {
            calories: 0,
            proteines: 0,
            fats: 0,
            carbohydrates: 0
        }
    };
    newMainStat.weight = mainStat.weight + (meal.weight || 0);
    newMainStat.price = mainStat.price + (meal.price || 0);
    newMainStat.energyValue.calories = mainStat.energyValue.calories + (meal.energyValue.calories || 0);
    newMainStat.energyValue.proteines = mainStat.energyValue.proteines + (meal.energyValue.proteines || 0);
    newMainStat.energyValue.fats = mainStat.energyValue.fats + (meal.energyValue.fats || 0);
    newMainStat.energyValue.carbohydrates = mainStat.energyValue.carbohydrates + (meal.energyValue.carbohydrates || 0);
    return newMainStat;
};

const createDailyStatObjectFromMealsArray = (intakeData, dailyMealsArray: Meal[], key: string) => {
    const dailyStatObject = {
        dateString: key,
        meals: [],
        weight: 0,
        price: 0,
        energyValue: {
            calories: 0,
            proteines: 0,
            fats: 0,
            carbohydrates: 0
        },
        energyValueDifference: {}
    };

    for (let i = 0; i < dailyMealsArray.length; i++) {
        const {_id, weight, price, name, energyValue} = dailyMealsArray[i];

        dailyStatObject.meals.push({_id, name, weight, price, energyValue});

        dailyStatObject.weight += weight;
        dailyStatObject.price += price;

        dailyStatObject.energyValue.calories += energyValue.calories;
        dailyStatObject.energyValue.proteines += energyValue.proteines;
        dailyStatObject.energyValue.fats += energyValue.fats;
        dailyStatObject.energyValue.carbohydrates += energyValue.carbohydrates;
    }
    // console.log('dailyStatObject', dailyStatObject);
    dailyStatObject.energyValueDifference = getStatDifferences(intakeData, dailyStatObject.energyValue);
    return dailyStatObject;
};

const createStatFromMealsArray = (intakeData, mealsArray) => {
    const statObject = {
        mainStat: {
            weight: 0,
            price: 0,
            energyValue: {
                calories: 0,
                proteines: 0,
                fats: 0,
                carbohydrates: 0
            }
        },
        statArray: []
    };

    if (!mealsArray.length) {
        return statObject;
    }

    const tempObjectDateKey = {};

    // fill tempObjectDateKey
    for (let key in mealsArray) {
        const currentMeal = mealsArray[key];
        //fill mainStat
        statObject.mainStat = mergeMealDataToMainStat(currentMeal, statObject.mainStat);
        const dateStringKey = currentMeal.dateString;
        if (!tempObjectDateKey[dateStringKey]) {
            tempObjectDateKey[dateStringKey] = [currentMeal];
        } else {
            tempObjectDateKey[dateStringKey].push(currentMeal);
        }
    }
    for (let key in tempObjectDateKey) {
        const dailyMealsArray = tempObjectDateKey[key];
        // console.log('dailyMealsArray', dailyMealsArray);
        const dailyStat = createDailyStatObjectFromMealsArray(intakeData, dailyMealsArray, key);
        statObject.statArray.push(dailyStat);
    }
    return statObject;
};

// api/stats/get_all
statsRouter.get('/get_all', async (req: Request, res: Response): Promise<Response> => {
    const {user} = req.body;
    try {
        let mealsArray = await Meal.find({owner: user._id}).select('_id name weight price energyValue dateString');
        const statObject = createStatFromMealsArray(user.intakeData, mealsArray);
        return res.status(201).json(statObject);
    } catch(error) {
        return handleDataBaseError(error, 500, res);
    }

});

// api/stats/get_stat_for_interval
statsRouter.post('/get_stat_for_interval', async (req: Request, res: Response): Promise<Response> => {
    const {user, interval} = req.body;
    try {
        let mealsArray = await Meal.find({
            owner: user._id,
            createdAt: {$gte: interval.from, $lte: interval.to}
        }).select('_id name weight price energyValue dateString');
        const statObject = createStatFromMealsArray(user.intakeData, mealsArray);
        return res.status(201).json(statObject);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

// api/stats/get_stat_for_day
statsRouter.post('/get_stat_for_day', async (req: Request, res: Response): Promise<Response> => {
    const {user, date} = req.body;
    const dateString = getDateStringFromJSONStringDate(date);
    try {
        let mealsArray = await Meal.find({owner: user._id, dateString: dateString}).select('_id name weight price energyValue dateString');
        const statObject = createStatFromMealsArray(user.intakeData, mealsArray);
        return res.status(201).json(statObject);
    } catch (error) {
        return handleDataBaseError(error, 500, res);
    }
});

