import {itemsTypes} from "./entitiesLists";

export const returnModelByType = (doc) => {
    switch (doc.type) {
        case itemsTypes.PRODUCT: return 'Product';
        case itemsTypes.DISH: return 'Dish';
    }
};