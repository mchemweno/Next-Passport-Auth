import decodeToken from "../../../../../utils/authUtils/decodeToken";
import User from "../../../../../models/User";
import middlewareHandler from "../../../../../utils/middlewareHandler";
import isAuth from "../../../../../utils/authUtils/isAuth";


export default async (req, res) => {
    const {method, query: {token}} = req;
    if (method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).end(`Method ${method} Not Allowed`);
    }


    try {
        const decodedToken = await middlewareHandler(req, res, isAuth);
        const user = await User.findById(decodedToken.user?.id);

        if (!user) {
            const err = new Error("User does not exist");
            err.statusCode = 404;
            throw err;
        }

        res.redirect(301, `/auth/resetPassword/${token}`);

    } catch (e) {

        if (!e.statusCode) {
            e.statusCode = 404;
        }

        res.status(e.statusCode).json({message: e.message});
    }
}
