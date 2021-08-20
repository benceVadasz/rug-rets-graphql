const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET} = require('./constants')

function getTokenPayload(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

function getUserId(req, authToken) {
    console.log('itt')
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

function isAuth(context) {
    const {userId} = context
    if (!userId) {
        throw new Error('Not authenticated')
    } else {
        return userId
    }
}

module.exports = {
    getUserId,
    isAuth
}