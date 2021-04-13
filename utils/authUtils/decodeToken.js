import jwt from "jsonwebtoken";


const decodeToken = (token) => {
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);

        if (Math.round(Date.now() / 1000) > decodedToken.exp) {
            const err = new Error('Token expired. ');
            throw err;
        }

        return decodedToken;
    } catch (err) {
        err.statusCode = 401;
        err.message = err.message + '. Not Authenticated.';
        return err;
    }
}

export default decodeToken;
