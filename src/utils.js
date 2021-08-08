const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET} = require('./constants')

function getTokenPayload(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

function getUserId(req, authToken) {
    if (req) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found');
            }
            const {id} = getTokenPayload(token);
            return id;
        }
    } else if (authToken) {
        const { id } = getTokenPayload(authToken);
        return id;
    }

    throw new Error('Not authenticated');
}

module.exports = {
    getUserId
}