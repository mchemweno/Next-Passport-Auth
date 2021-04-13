import passport from "passport";

const authenticateHandler = (method, req, res) =>
    new Promise((resolve, reject) => {
        passport.authenticate(method, {session: false}, (error, token) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        })(req, res);
    });


export default authenticateHandler;
