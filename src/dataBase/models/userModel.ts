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
        type: Object
    },
    products: {
        type: Array,
    },
    meals: {
        type: Array,
    },
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