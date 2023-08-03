import {Schema, model, Types} from 'mongoose';
import bcrypt from 'bcryptjs'

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
        energyValue: {
            calories: Number,
            proteines: Number,
            fats: Number,
            carbohydrates: Number
        } || {},
    },
    role: {
        type: String,
        required: true,
    },
    products: [{
        type: Types.ObjectId,
        ref: 'Product'
    }],
    dishes: [{
        type: Types.ObjectId,
        ref: 'Dish'
    }],
    meals: [{
        type: Types.ObjectId,
        ref: 'Meal'
    }],
}, {timestamps: true});

userSchema.pre('save', async function (next){
    if (!this.isModified('password')) {
        next();
    } else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export = model('User', userSchema);