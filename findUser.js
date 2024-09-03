const fs = require('fs')

module.exports = function findUser(email) {
    const data = fs.readFileSync('./db/users.txt')
    const users = JSON.parse(data)
    let foundUser = null
    users.forEach(user => {
        const jsonUser = JSON.parse(user)
        if (jsonUser.email === email) {
            foundUser = jsonUser
        }
    })
    return foundUser
}