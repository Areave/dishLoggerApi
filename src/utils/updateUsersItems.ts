import {User} from "../dataBase/models";
import {handleDataBaseError} from "./handleDataBaseError";
import {rebaseIngridients} from "./rebaseIngridients";

const updateUsersItems = async (res, userId, Model) => {
    console.log(Model);
    try {
        const promiseAllArray = await Promise.all([
            // User.updateOne({_id: userId}, items),
            // Model.find({owner: userId}).select('-owner').populate({
            //     path:'ingridients.ingridient',
            //     match: { 'type': 'MEAL' || 'DISH',}
            // })
            Model.find({owner: userId}).select('-owner')
        ]);
        const itemsArray = rebaseIngridients(promiseAllArray[0]);
        return res.status(201).json(itemsArray);
    } catch (error) {
        console.log('error from updateUsersItems', error);
        handleDataBaseError(error, 500, res)
    }
};

export default updateUsersItems;