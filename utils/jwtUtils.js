const jwt = require('jsonwebtoken');

exports.generateJWT = (data) => {
    const secret = process.env.JWT_SECRET || 'super-secret';
    return jwt.sign(data, secret, { expiresIn: '1h' }); // Le token expire après 1 heure
};
