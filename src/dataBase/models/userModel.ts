import {Schema, model, Types} from 'mongoose';

const userSchema = new Schema({
    telegramNickname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    words: [{
        type: Types.ObjectId,
        ref: 'Word'
    }],
    stats: {
        type: Types.ObjectId,
        ref: "Stats"
    }
});

export = model('User', userSchema);