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
    dailyStats: {
        type: Array
    },
    products: [{
        type: Types.ObjectId,
        ref: 'Product'
    }],
    dishes: {
        type: Array,
    },
    meals: {
        type: Array,
    },
}, {timestamps: true});

userSchema.pre('save', async function (next){
    console.log('pre hook');
    console.log('this.password', this.password);
    console.log('this.isModified(\'password\')', this.isModified('password'));
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