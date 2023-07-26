import {ObjectId} from "bson";

const generateObjectId = (id: string) => {
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (error) {
        throw new Error(error.message);
    }
    return objectId;
};

export default generateObjectId;