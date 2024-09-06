const express = require('express')
const { getMovies, getFavorites, addFavorite } = require('../repositories/moviesRepository')
const router = express.Router()

const authenticator = require('../middleware/authenticator')

router.get('/', authenticator, async (req, res) => {
    try {
    const movies = await getMovies(req.query.keyword);
    res.send(movies)
    } catch (error){
        res.status(500).send('Internal Server Error')
    }
})

router.get('/favorites', authenticator,  (req, res) => {
    try{
        const favorites = getFavorites(req.user.email)
        res.send(favorites)
    } catch (error){
        res.status(500).send('Internal Server Error')
    }
})

router.post('/favorites', authenticator,  async (req, res) => {
    const movie_id = req.body.movie_id
    if(!movie_id){
        return res.status(400).send('Movie ID is required')
    }
    const email = req.user.email
    try{
        const added = addFavorite(email, movie_id)
        if (added){
            res.status(200).send('Favorite added')
        } else {
            res.status(400).send('Movie already in favorites')
        }
    } catch (error){
        res.status(500).send('Internal Server Error' + error)
    }    
})

module.exports = router