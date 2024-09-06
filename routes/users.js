const express = require('express')
const { findUser, createUser, credentialsValid, blacklistToken } = require('../repositories/usersRepository')
const router = express.Router()

const authenticator = require('../middleware/authenticator')
const userFormValidator = require('../middleware/userFormValidator')

router.post('/', userFormValidator, async (req, res) => {
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password
    try {
        await createUser(email, firstName, lastName, password)
        res.status(201).send('User created')
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = findUser(req.body.email)
        if (!user) {
            return res.status(404).send('User not found')
        }
        const password = req.body.password
        const jsonToken = await credentialsValid(password, user.email, user.password)
        if (jsonToken) {
            res.send(jsonToken)
        } else {
            res.status(401).send('Invalid credentials')
        }
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

router.delete('/logout', authenticator, (req, res) => {
    const blacklistedToken = {token: req.token}
    try{
        blacklistToken(blacklistedToken)
        res.send('Logged out')
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

module.exports = router