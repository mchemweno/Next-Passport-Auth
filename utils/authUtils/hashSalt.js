import crypto from 'crypto';

const hashSalt = async (password, salt) => {
    if (!salt) {
        salt = crypto.randomBytes(16).toString('hex');
    }

    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
    return {hash:hash, salt:salt}
};

export default hashSalt;
