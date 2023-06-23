import mongoose from 'mongoose'

export const dbConnect = (uri) => {
    try {
        return mongoose.connect(uri);
    } catch (error) {
        console.log('database connected error', error.message);
        process.exit(1);
    }

};

export const addInstance = (Schema, params) => {
    const instance = new Schema(params);
    return instance.save();
};