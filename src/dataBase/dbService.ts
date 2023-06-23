import mongoose from 'mongoose'

export const dbConnect = async (uri) => {
    let connect;
    try {
        console.log(uri);
        connect = await mongoose.connect(uri);
    } catch (error) {
        console.log('database connected error', error.message);
        process.exit(1);
    }
    return connect;

};

export const addInstance = (Schema, params) => {
    const instance = new Schema(params);
    return instance.save();
};