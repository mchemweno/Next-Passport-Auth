import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import sendEmail from "../../../../utils/nodemailer";

export default async (req, res) => {
    const {method} = req;

    if (method !== 'POST') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    const {email} = req.body;

    try {

        if (!email) {
            const err = new Error("Please include email.");
            err.status = 400;
            throw err;
        }

        await dbConnect();

        const user = await User.findOne({email: email});

        if (!user || user.provider !== 'local') {
            const err = new Error("User does not exist.");
            err.statusCode = 400;
            throw err;
        }

        const token = jwt.sign({
                user: {
                    id: user._id,
                    email: user.email
                }
            }, process.env.SECRET,
            {
                expiresIn: '30m'
            });

        await sendEmail(
            user.email,
            'Password Reset.',
            `${process.env.domain}/api/auth/resetPassword/${token}`);

        res.status(200).json({message: 'Password reset email sent.'})
    } catch (e) {
        if (!e.statusCode) {
            e.statusCode = 400;
        }
        return res.status(e.statusCode).json({message: e.message})
    }
}


