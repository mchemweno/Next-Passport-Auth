import middlewareHandler from "../../../../utils/middlewareHandler";
import isAuth from "../../../../utils/authUtils/isAuth";
import User from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";
import hashSalt from "../../../../utils/authUtils/hashSalt";

export default async (req, res) => {

    const {password} = req.body;
    const {rePassword} = req.body;

    const {user: {id}} = await middlewareHandler(req, res, isAuth);
    try {
        await dbConnect();
        const user = await User.findById(id);

        if (!user) {
            const err = new Error("User does not exist");
            err.status = 404;
            throw err;
        }

        if (password !== rePassword) {
            return res.status(400).json({message: "Passwords don't match"});
        }

        const {hash, salt} = await hashSalt(password);

        user.hash = hash;
        user.salt = salt;
        await user.save();

        res.status(200).json({message: "Password reset successful"});

    } catch (e) {
        console.log(e.message);
        res.status(404).json({message: e.message})
    }
}
