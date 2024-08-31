const express = require('express')
const router = express.Router()

router.get('/:keyword', (req, res) => {
    req.params.keyword
    res.send('All movies that match the keyword: ' + req.params.keyword)
})

router.get('/favorites', (req, res) => {
    res.send('All favorite movies')
})

router.post('/favorites/add', (req, res) => {
    res.send('Movie added to favorites')
})



module.exports = router