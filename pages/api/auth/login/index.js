import passport from "passport";
import nextConnect from "next-connect";
import localStrategy from "../../../../utils/authUtils/passportLocal";
import jwt from "jsonwebtoken";
import authenticateHandler from "../../../../utils/authUtils/authenticateHandler";



passport.use(localStrategy);


export default nextConnect()
    .use(passport.initialize())
    .post(async (req, res) => {
        try {
            const user = await authenticateHandler('local', req, res);
            if (!user) {
                const err = new Error('Failed to login with given credentials');
                throw err;
            }
            // session is the payload to save in the token, it may contain basic info about the user

            const token = jwt.sign({
                    user: {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        provider: user.provider
                    }
                }, process.env.SECRET,
                {
                    expiresIn: '30d'
                });
            res.status(200).json({
                token: token, user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    provider: user.provider
                }
            })
        } catch (error) {
            res.status(401).json(error.message)
        }
    })
