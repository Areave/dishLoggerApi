import {messageTypes} from "./entitiesLists";

export const handleDataBaseError = (error, code, res) => {
    return res.status(code).json({
        type: messageTypes.ERROR,
        text: 'Database problems',
        stack: error.message
    });
};