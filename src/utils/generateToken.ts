import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";
//
// dotenv.config();

const isForPostmanTesting = process.argv[2];


const generateToken = (res, userId) => {

    const token = jwt.sign(
        {userId},
        process.env.jwtKey,
        {expiresIn: '30d'});
    res.cookie('jwt', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== 'development',
        // secure: true,

        secure: !isForPostmanTesting,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

export default generateToken;