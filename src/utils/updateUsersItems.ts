import {User} from "../dataBase/models";
import {handleDataBaseError} from "./handleDataBaseError";
import {rebaseIngridients} from "./rebaseIngridients";

const updateUsersItems = async (res, userId, items, Model) => {
    try {
        const promiseAllArray = await Promise.all([
            User.updateOne({_id: userId}, items),
            Model.find({owner: userId}).select('-owner').populate('ingridientsIds')
        ]);
        const itemsArray = rebaseIngridients(promiseAllArray[1]);
        return res.status(201).json(itemsArray);
    } catch (error) {
        handleDataBaseError(error, 500, res)
    }
};

export default updateUsersItems;