import passport from 'passport';
import FacebookStrategy from "../../../../utils/authUtils/passportFacebook";
import authenticateHandler from "../../../../utils/authUtils/authenticateHandler";
import nextConnect from "next-connect";

passport.use(FacebookStrategy);


export default nextConnect()
    .use(passport.initialize())
    .get(async (req, res) => {
            await authenticateHandler('facebook', req, res)
        }
    )
