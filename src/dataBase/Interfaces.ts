export interface WordInterface {
    word: string,
    translation: string,
    language: string,
    countOfGuess: number
}

export interface productInterface {
    name: string,
    id: number,
    description?: string,
    weightOfPieceGr: number,
    price: {
        priceForPiece: number,
        priceFor100g: number,
    },
    energyValueFor100g: {
        calories: number,
        proteines: number,
        fats: number,
        carbohydrates: number,
    }
}