import Facebook from 'passport-facebook';
import User from "../../models/User";

const FacebookStrategy = new Facebook.Strategy(
    {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["email", "name"],
        scope: ['email'],
        display: 'popup'
    },
    async function (accessToken, refreshToken, profile, done) {
        try {
            if (!profile?.emails[0]?.value) {
                const err = new Error('Profile missing email');
                throw err;
            }
            const email = profile.emails[0].value;

            const user = new User({
                email : email,
                username: email.split('@')[0],
                provider: 'facebook'
            });

            const finalUser = await user.findOrCreate();
            return done(null, finalUser);
        } catch (err) {
            return done(err);
        }
    }
)

export default FacebookStrategy;
