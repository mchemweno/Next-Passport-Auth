// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import isAuth from "../../utils/authUtils/isAuth";
import middlewareHandler from "../../utils/middlewareHandler";


export default async (req, res) => {
    try {
        const user = await middlewareHandler(req, res, isAuth);
        res.status(200).json({user: user})

    } catch (err) {
        res.status(err.statusCode).json({message: err.message})
    }
}
