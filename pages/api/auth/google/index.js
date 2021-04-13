import passport from 'passport';
import GoogleStrategy from "../../../../utils/authUtils/passportGoogle";
import authenticateHandler from "../../../../utils/authUtils/authenticateHandler";
import nextConnect from "next-connect";

passport.use(GoogleStrategy);


export default nextConnect()
    .use(passport.initialize())
    .get(async (req, res) => {
            await authenticateHandler('google', req, res)
        }
    )
