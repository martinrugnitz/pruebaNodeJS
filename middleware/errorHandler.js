module.exports = function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
    res.status(statusCode)
    const response_body = {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    }
    console.error('Error: ', response_body)
    res.json(response_body)
}