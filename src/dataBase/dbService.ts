import mongoose from 'mongoose'

export const dbConnect = (uri) => {
    return mongoose.connect(uri);
};

export const addInstance = (Schema, params) => {
    const instance = new Schema(params);
    return instance.save();
};