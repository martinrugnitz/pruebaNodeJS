const jwt = require('jsonwebtoken')
const fs = require('fs')

module.exports = function authenticator (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).send('Unauthorized access.')
    if(isBlacklisted(token)) return res.status(403).send('Token was logged out.')
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if(err) return res.status(403).send('Invalid token.')
        req.user = user
        req.token = token
        next()
    })
}

function isBlacklisted(token){
    const data = fs.readFileSync('./db/blacklistedTokens.txt')
    const blacklistedTokens = JSON.parse(data)
    let blacklisted = false
    blacklistedTokens.forEach(blacklistedToken => {
        if(blacklistedToken.token === token){
            blacklisted = true
        }
    })
    return blacklisted
}