export interface WordInterface {
    word: string,
    translation: string,
    language: string,
    countOfGuess: number
}

export interface UserInterface {
    telegramLogin: string,
    email: string,
    password: string,
    words: Array<Object>
}