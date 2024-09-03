const express = require('express')
const axios = require('axios')
const fs = require('fs')
const router = express.Router()

const authenticator = require('../middleware/authenticator')

const client = axios.create({
  baseURL: process.env.MOVIEDB_API_URL,
  timeout: 1000,
  headers: {'accept': 'application/json'}
})

router.get('/', authenticator, async (req, res) => {
    try {
    const keyword = req.query.keyword
    console.log('keyword: ', keyword)
    let response
    if (!keyword){
        response = await client.get("/discover/movie", {params: {api_key: process.env.MOVIEDB_API_KEY}})
    } else {
        response = await client.get("/search/movie", {params: {api_key: process.env.MOVIEDB_API_KEY, query: keyword}})
    }
    let movies = response.data.results
    movies.forEach(movie => {
        movie.suggestionScore = Math.floor(Math.random() * 100)
    })
    movies.sort((a, b) => b.suggestionScore - a.suggestionScore)
    res.send(movies)
    } catch (error){
        res.status(500).send('Internal Server Error')
    }
})

router.get('/favorites', authenticator,  (req, res) => {
    const favoritesData = fs.readFileSync('./db/favorites.txt')
    const favorites = JSON.parse(favoritesData)
    favorites.forEach( user => {
        const jsonUser = JSON.parse(user)
        if(jsonUser.email === req.user.email){
            if(jsonUser.favorites.length !== 0){ 
                jsonUser.favorites.forEach( userFavorite => {
                userFavorite.suggestionForTodayScore = Math.floor(Math.random() * 100)
                })
            jsonUser.favorites.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore)
            }    
            res.send(jsonUser.favorites)
        }    
    })
})

router.post('/favorites', authenticator,  async (req, res) => {
    const favoritesData = fs.readFileSync('./db/favorites.txt')
    const favorites = JSON.parse(favoritesData)
    favorites.forEach( user => {
        const jsonUser = JSON.parse(user)
        if(jsonUser.email === req.user.email){
            if(jsonUser.favorites.includes(req.body.movie_id)){
                return res.status(400).send('Movie already in favorites')
            } else {
                const date = new Date()
                const currentDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
                jsonUser.favorites.push({ "movie_id": req.body.movie_id, "addedAt": currentDate})
                favorites[favorites.indexOf(user)] = JSON.stringify(jsonUser)
                console.log('jsonUserlist: ', jsonUser.favorites)
                fs.writeFileSync('./db/favorites.txt', JSON.stringify(favorites, null, 4))
                res.status(200).send('Favorite added')
            }
        }
    })
})

module.exports = router