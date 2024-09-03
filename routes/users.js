const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fs = require('fs')
const router = express.Router()

const authenticator = require('../middleware/authenticator')
const userFormValidator = require('../middleware/userFormValidator')

router.post('/', userFormValidator, async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = {email: req.body.email, password: hashedPassword, firstName: req.body.firstName, lastName: req.body.lastName} // create new user object
        const jsonUser = JSON.stringify(user) // convert user object to JSON nicely formatted string
        const data = fs.readFileSync('./db/users.txt')
        const users = JSON.parse(data)
        users.push(jsonUser)
        fs.writeFileSync('./db/users.txt', JSON.stringify(users, null, 4)) // write the json array with the new user to file
        // add a favorites list for the user
        const favoritesJson = JSON.stringify({email: req.body.email, favorites: []})
        const favoritesData = fs.readFileSync('./db/favorites.txt')
        const favorites = JSON.parse(favoritesData)
        favorites.push(favoritesJson)
        fs.writeFileSync('./db/favorites.txt', JSON.stringify(favorites, null, 4))
        res.status(201).send('User created')
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

const findUser = require('../findUser')

router.post('/login', async (req, res) => {
    const user = findUser(req.body.email)
    if (!user) {
        return res.status(404).send('User not found')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            jwt.sign({email: user.email}, process.env.SECRET_KEY, (err, token) => {
                if (err) {
                    res.sendStatus(500).send('Internal Server Error')
                } else {
                    res.json({token: token})
                }
            })
        } else {
            res.status(401).send('Invalid credentials')
        }
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

router.delete('/logout', authenticator, (req, res) => {
    const blacklistedToken = {token: req.token}
    const data = fs.readFileSync('./db/blacklistedTokens.txt')
    const blacklistedTokens = JSON.parse(data)
    blacklistedTokens.push(blacklistedToken)
    fs.writeFileSync('./db/blacklistedTokens.txt', JSON.stringify(blacklistedTokens, null, 4))
    res.send('Logged out')
})

module.exports = router