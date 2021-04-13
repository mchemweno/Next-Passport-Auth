import nextConnect from "next-connect";
import passport from "passport";
import authenticateHandler from "../../../../../utils/authUtils/authenticateHandler";
import jwt from "jsonwebtoken";

export default nextConnect()
    .use(passport.initialize())
    .get(async (req, res) => {
            try {
                const user = await authenticateHandler('facebook', req, res);

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
            } catch (err) {
                res.status(401).json(err.message)
            }

        }
    )
