import {messageTypes} from "./entitiesLists";

export const handleDataBaseError = (error, code, res) => {
    res.status(code).json({
        message: {
            type: messageTypes.ERROR,
            text: 'Database problems'
        },
        stack: error.message
    });
};