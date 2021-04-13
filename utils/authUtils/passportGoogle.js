import Google from 'passport-google-oauth20';
import User from "../../models/User";

const GoogleStrategy = new Google.Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    },
    async function (accessToken, refreshToken, profile, done) {
        try {
            if (!profile?.emails[0]?.value) {
                const err = new Error('Profile missing email');
                throw err;
            }
            const email = profile.emails[0].value;

            const user = new User({
                email: email,
                username: email.split('@')[0],
                provider: 'google'
            });

            const finalUser = await user.findOrCreate();
            return done(null, finalUser);
        } catch (err) {
            return done(err);
        }
    }
);

export default GoogleStrategy;
