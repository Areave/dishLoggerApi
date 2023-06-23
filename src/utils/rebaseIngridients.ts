import listOfEntity from '../utils/listOfEntity'

const rebaseIngridients = function (instanceArray) {
    if (!instanceArray.length) {
        return instanceArray;
    }
    instanceArray.forEach( instance => {
        const ingridientsIds = instance.ingridientsIds;
        const ingridientsAmount = instance.ingridientsAmount;
        const ingridients = [];

        listOfEntity.forEach( entityKey => {
            if (!ingridientsIds[entityKey]) {
                return;
            }
            ingridientsIds[entityKey].forEach((ingridientObject, index) => {
                ingridients.push({ingridient: ingridientObject, amount: ingridientsAmount[entityKey][index]})
            });
        });

        instance.ingridientsIds = [];
        instance.ingridientsAmount = [];
        instance.ingridients = ingridients;
    });
    return instanceArray;
};

export default rebaseIngridients;