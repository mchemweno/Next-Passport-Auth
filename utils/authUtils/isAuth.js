import decodeToken from "./decodeToken";


const isAuth = (req, res, next) => {

    const {authorization} = req.headers;
    const {query: {token}} = req;
    let decodedToken;

    try {

        if (!authorization && !token) {
            const err = new Error('Authorization header missing. Not Authenticated');
            err.statusCode = 401;
            throw err;
        }
        let authToken;
        if(authorization) {
            authToken = authorization.split(' ')[1];
        }

        if(token) {
            authToken = token
        }

        decodedToken = decodeToken(authToken);
        next(decodedToken);
    } catch (err) {
        return err;
    }
}

export default isAuth;
