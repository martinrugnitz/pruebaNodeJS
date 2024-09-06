const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function findUser(email) {
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

async function createUser(email, firstName, lastName, password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = {email: email, password: hashedPassword, firstName: firstName, lastName: lastName} // create new user object
    const jsonUser = JSON.stringify(user) // convert user object to JSON nicely formatted string
    const data = fs.readFileSync('./db/users.txt')
    const users = JSON.parse(data)
    users.push(jsonUser)
    fs.writeFileSync('./db/users.txt', JSON.stringify(users, null, 4)) // write the json array with the new user to file
    // add a favorites list for the user
    const favoritesJson = JSON.stringify({email: email, favorites: []})
    const favoritesData = fs.readFileSync('./db/favorites.txt')
    const favorites = JSON.parse(favoritesData)
    favorites.push(favoritesJson)
    fs.writeFileSync('./db/favorites.txt', JSON.stringify(favorites, null, 4))
}

async function credentialsValid(password, email, userPassword) {
    if (await bcrypt.compare(password, userPassword)) {
        try {
            const token = await new Promise((resolve, reject) => {
                jwt.sign({email: email}, process.env.SECRET_KEY, (err, token) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(token)
                    }
                })
            })
            const jsonToken = JSON.stringify({token: token})
            return jsonToken
        } catch (error) {
            throw err
        } 
    } else {
        return null
    }
}

function blacklistToken(blacklistedToken) {
    const data = fs.readFileSync('./db/blacklistedTokens.txt')
    const blacklistedTokens = JSON.parse(data)
    blacklistedTokens.push(blacklistedToken)
    fs.writeFileSync('./db/blacklistedTokens.txt', JSON.stringify(blacklistedTokens, null, 4))
}

module.exports = {findUser, createUser, credentialsValid, blacklistToken}	