
export function authenticator (req, res, next) {
    console.log('Authenticating user...')
    if(/* user is authenticated */ true) {
        next()
    } else {
        return res.status(401).send('Unauthorized access.')
    }
}