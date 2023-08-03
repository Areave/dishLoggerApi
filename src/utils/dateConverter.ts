export const getDateStringFromRawDate = (date: Date): string => {
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
};

export const getRawDateFromDateString = (dateString: string): Date => {
    const array = dateString.split('.');
    return new Date(Date.parse([array[1], array[0], array[2]].join('.')));
};
export const getDateStringFromJSONStringDate = (JSONdateString: string): string => {
    const rawDate = new Date(Date.parse(JSONdateString));
    return getDateStringFromRawDate(rawDate);
};