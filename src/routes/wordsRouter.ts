import {Router, Request, Response} from 'express';
import {Word, User} from "../dataBase/models";
import {ParamsDictionary} from "express-serve-static-core";
import {authMiddleware} from './middlewares/authMiddleware'

export const wordsRouter = Router({strict: true});

// words/create
wordsRouter.post('/create', authMiddleware, async (req: Request<ParamsDictionary>, res: Response): Promise<Response> => {
    // try {
    //     const {word, translation, language, telegramNickname} = req.body;
    //     const existingInstance = await Word.findOne({word});
    //     if (existingInstance) {
    //         return res.status(400).json({message: 'word is already exist in database'});
    //     }
    //     const isUserExist = await User.findOne({telegramNickname});
    //     let user;
    //     if (!isUserExist) {
    //         user = new User({
    //             telegramNickname
    //         });
    //         await user.save();
    //     } else {
    //         user = isUserExist;
    //     }
    //     const newWord = new Word({word, translation, language, owner: user});
    //     await newWord.save();
    //     res.status(201).json({message: 'word added'});
    // } catch (error) {
    //     console.log('from server', error.message);
        return res.status(500).json({message: 'error.message'});
    // }
});

// words/get
wordsRouter.get('/get', authMiddleware, async (req: Request<ParamsDictionary>, res: Response): Promise<Response> => {
    try {
        console.log('server words/get');
        const telegramNickname = req.body.telegramNickname;
        const user = await User.findOne({telegramNickname});
        if (!user) {
            res.status(401).json({message: 'user ' + telegramNickname + ' not found'})
        }
        let wordsArray = await Word.find({owner: user});
        return res.status(201).json({message: 'words was found', wordsArray: wordsArray});
    } catch (error) {
        console.log('from server words/get', error.message);
        res.status(500).json({message: error.message})
    }
});

// words/get/:id
wordsRouter.get('/get/:id', authMiddleware, async (req: Request<ParamsDictionary>, res: Response): Promise<Response> => {
    try {
        const word = req.params.id;
        const telegramNickname = req.body.telegramNickname;
        const user = await User.findOne({telegramNickname});
        if (!user) {
            res.status(401).json({message: 'user ' + telegramNickname + ' not found'})
        }
        let existingInstance = await Word.findOne({word, owner: user});
        if (!existingInstance) {
            existingInstance = await Word.findOne({translation: word, owner: user});
        }

        if (existingInstance) {
            return res.status(201).json({message: 'word was found', word: existingInstance});
        }
        return res.status(400).json({message: 'no such word in database'});
    } catch (error) {
        console.log('from server', error.message);
        res.status(500).json({message: error.message})
    }
});

// words/update
wordsRouter.patch('/update', authMiddleware, async (req: Request<ParamsDictionary>, res: Response): Promise<Response> => {
    try {
        const {word, translation, language, telegramNickname} = req.body;
        const existingInstance = await Word.findOne({word, owner: {telegramNickname}});
        if (!existingInstance) {
            return res.status(400).json({message: 'word is not exist in database'});
        }
        await Word.updateOne({word, translation, language});
        res.status(201).json({message: 'word updated in database'});
    } catch (error) {
        console.log('from server', error.message)
        res.status(500).json({message: error.message})
    }
});

// words/remove
wordsRouter.delete('/remove', authMiddleware, async (req: Request<ParamsDictionary>, res: Response): Promise<Response> => {
    try {
        const {word, telegramNickname} = req.body;
        const user = await User.findOne({telegramNickname});
        if (!user) {
            res.status(401).json({message: 'user ' + telegramNickname + ' not found'})
        }
        const existingInstance = await Word.findOne({word, owner: user});
        if (!existingInstance) {
            return res.status(400).json({message: 'word is not exist in database'});
        }
        await Word.deleteOne({word, owner: user});
        res.status(201).json({message: 'word removed from database'});
    } catch (error) {
        console.log('from server', error.message)
        res.status(500).json({message: error.message})
    }
});
