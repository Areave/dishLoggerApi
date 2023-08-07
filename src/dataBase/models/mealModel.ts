import {Schema, model, Types} from 'mongoose';
import {itemsTypes} from "../../utils/entitiesLists";


const returnModelByType = (doc) => {
    const parentType = doc.type;
    switch (parentType) {
        case itemsTypes.PRODUCT: return 'Product';
        case itemsTypes.DISH: return 'Dish';
    }
};

const mealSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    description: String,
    owner: {
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    },
    dateString: String,
    ingridients: [
        {
            ingridient: {
                type: Types.ObjectId,
                require: true,
                // ref: 'Dish'
                ref: returnModelByType
            },
            type: {
                type: String,
                required: true
            },
            weight: Number,
            amountOfItems: Number,
            price: Number,
            energyValue: {
                calories: Number,
                proteines: Number,
                fats: Number,
                carbohydrates: Number
            }
        }
    ],
    weight: Number,
    price: Number,
    energyValue: {
        calories: Number,
        proteines: Number,
        fats: Number,
        carbohydrates: Number
    }
}, {timestamps: true});

export = model('Meal', mealSchema);