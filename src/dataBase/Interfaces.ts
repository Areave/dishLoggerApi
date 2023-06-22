export interface User {
    name?: string,
    login: string,
    password: string,
    intakeData: {
        expencesForDay: number,
        energyValueForDay: {
            calories: number,
            proteines: number,
            fats: number,
            carbohydrates: number,
        }
    },
    dailyStats: Array<DailyStat>,
    products: Array<Product>,
    dishes: Array<Dish>,
    meals: Array<Meal>,
}

export interface Product {
    id: number,
    name: string,
    type: string,
    description?: string,
    weightOfPieceGr: number,
    price: {
        priceForPiece: number,
        priceFor100g: number,
    },
    energyValueFor100g: {
        calories: number,
        proteines: number,
        fats: number,
        carbohydrates: number,
    }
}

export interface Dish {
    name: string,
    id: number,
    type: string,
    description?: string,
    weightOfPieceGr: number,
    products: [
        {
            product: Product,
            amountGr: number
        }
    ],
    price: {
        priceForPiece: number,
        priceFor100g: number,
    },
    energyValue: {
        energyValueFor100g: {
            calories: number,
            proteines: number,
            fats: number,
            carbohydrates: number,
        }
        energyValueForPiece: {
            calories: number,
            proteines: number,
            fats: number,
            carbohydrates: number,
        }
    }
}

export interface Meal {
    name: string,
    id: number,
    type: string,
    description?: string,
    weightOfPieceGr: number,
    ingridients: {
        dishes: [{
            dish: Dish,
            amountGr: number
        }],
        products: [{
            product: Product,
            amountGr: number
        }],
    },
    price: number,
    energyValue: {
        calories: number,
        proteines: number,
        fats: number,
        carbohydrates: number,
    }
}

export interface DailyStat {
    date: Date,
    id: number,
    description?: string,
    meals: Array<Meal>,
    weightOfMeals: number,
    price: number,
    energyValue: {
        calories: number,
        proteines: number,
        fats: number,
        carbohydrates: number,
    },
    differentFromIntakeData: {
        price: number,
        energyValue: {
            calories: number,
            proteines: number,
            fats: number,
            carbohydrates: number,
        }
    }
}