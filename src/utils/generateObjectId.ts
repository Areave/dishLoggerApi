import {ObjectId} from "bson";

const generateObjectId = (id: string) => {
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (error) {
        throw new Error();
    }
    return objectId;
};

export default generateObjectId;