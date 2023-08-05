export const rebaseIngridients = function (entitiesArray) {
    if (!entitiesArray || !entitiesArray.length) {
        return [];
    }

    // console.log('entitiesArray', entitiesArray);

    entitiesArray.forEach(function (entity) {
        // console.log('entity',entity)

        var ingridientsIds = entity.ingridientsIds;
        var ingridientsAmount = entity.ingridientsAmount;
        if (!ingridientsIds || !ingridientsAmount) {
            return entity;
        }
        const ingridients = [];
        ingridientsAmount.forEach((ingridientAmountObject, index) => {
            const ingridient = ingridientsIds[index];
            ingridients.push({...ingridientAmountObject._doc, ingridient});
        });
        entity._doc = {...entity._doc, ingridients};

    });

    return entitiesArray;
};
