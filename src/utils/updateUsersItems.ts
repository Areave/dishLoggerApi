import {User} from "../dataBase/models";

const updateUsersItems = async (res, userId, items, Model) => {
    try {
        const promiseAllArray = await Promise.all([
            User.updateOne({_id: userId}, items),
            Model.find({owner: userId}).select('-owner')
        ]);
        return res.status(201).json(promiseAllArray[1]);
    } catch (error) {
        return res.status(500).json({
            message: "Database problems",
            stack: error.message
        });
    }
};

export default updateUsersItems;