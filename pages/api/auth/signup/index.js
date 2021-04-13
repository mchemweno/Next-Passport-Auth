import User from "../../../../models/User";
import hashSalt from "../../../../utils/authUtils/hashSalt";
import dbConnect from "../../../../utils/dbConnect";

export default async (req, res) => {
    const {email} = req.body;
    const {password} = req.body;
    const {username} = req.body;
    const {hash, salt} = await hashSalt(password);
    const {method} = req;

    if (method !== 'POST') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    await dbConnect();


    const user = new User({
        email,
        username,
        hash,
        salt,
    });

    try {
        const userEmailExists = await User.findOne({email: email});
        const userUsernameExists = await User.findOne({username: username});

        if (userUsernameExists) {
            if (userUsernameExists.email === email) {

            } else {
                const err = new Error('Username Exists.');
                err.status = 404;
                throw err;
            }
        }

        if (userEmailExists) {
            if (userEmailExists.provider !== 'local') {
                userEmailExists.email = email;
                userEmailExists.username = username;
                userEmailExists.hash = hash;
                userEmailExists.salt = salt;
                userEmailExists.provider = 'local';
                userEmailExists.save();
                return res.status(201).json({message: "User created!.", user: userEmailExists});
            }
            const err = new Error('Email Exists.');
            err.status = 404;
            throw err
        }

        user.save();
        return res.status(201).json({message: "User created!.", user: user});

    } catch (err) {
        if (!err.status) {
            err.status = 500;
            err.msg = 'Something went badly wrong please try again later';
        }
        return res.status(err.status).json({message: err.message});
    }
};
