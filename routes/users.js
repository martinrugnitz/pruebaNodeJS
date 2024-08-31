const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post('/new', (req, res) => {
    res.send(req.body.email)
})

router.post('/login', (req, res) => {
    
})

router.post('/logout', /*authenticator,*/ (req, res) => { // check if post is correct
    res.send('User logout')
})

module.exports = router