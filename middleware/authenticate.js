const jwt = require('jsonwebtoken');

const secret = 'EiKf9vBVMW0Qiu6EWgzwU7PyCdD0BLxv7ks4kTe4fXvGPDYsS3QT3wugV4ReGopt'

const authenticateToken = async (req, res, next) => {
    const authHeader = await req.headers['authorization'];
    console.log(authHeader);
    let authToken = ''
    if (authHeader) {
        authToken = authHeader.split(' ')[1]
        console.log("authToken:", authToken);
        jwt.verify(authToken, secret, (err, authen) => {
            if (err) {
                console.log("invalid token");
                return res.status(403).json();
            }
            next();
        })
    } else {
        console.log('no token');
        return res.status(401).json();
    }
}

module.exports = authenticateToken