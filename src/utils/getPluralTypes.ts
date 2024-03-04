import {itemsTypes} from "./entitiesLists";

export const getPluralItemType = (itemType: string): string => {
    switch (itemType) {
        case itemsTypes.MEAL: return 'meals';
        case itemsTypes.DISH: return 'dishes';
        case itemsTypes.PRODUCT: return 'products';
    }
};