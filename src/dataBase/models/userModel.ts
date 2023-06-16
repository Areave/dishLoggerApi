import {Schema, model, Types} from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String
    },
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    intakeData: {
        type: Object
    },
    products: {
        type: Array,
    },
    meals: {
        type: Array,
    },
});

export = model('User', userSchema);