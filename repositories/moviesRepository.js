const axios = require('axios')
const { json } = require('express')
const fs = require('fs')

const client = axios.create({
  baseURL: process.env.MOVIEDB_API_URL,
  timeout: 1000,
  headers: {'accept': 'application/json'}
})

async function getMovies(keyword){
    try {
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
        return movies
    } catch (error) {
        throw error
    }
}

function getFavorites(email){
    const favoritesData = fs.readFileSync('./db/favorites.txt')
    const favorites = JSON.parse(favoritesData)
    for(let user of favorites){
        const jsonUser = JSON.parse(user)
        if(jsonUser.email === email){
            if(jsonUser.favorites.length !== 0){ 
                jsonUser.favorites.forEach( userFavorite => {
                    userFavorite.suggestionForTodayScore = Math.floor(Math.random() * 100)
                })
                jsonUser.favorites.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore)
            }  
            console.log(jsonUser.favorites)
            return jsonUser.favorites
        }    
    }
}

function addFavorite(email, movie_id){    
    const favoritesData = fs.readFileSync('./db/favorites.txt')
    const favorites = JSON.parse(favoritesData)
    for(let user of favorites){
        const jsonUser = JSON.parse(user)
        if(jsonUser.email === email){
            if(jsonUser.favorites.find(favorite => favorite.movie_id === movie_id)){
                return false
            } else {
                const date = new Date()
                const currentDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
                jsonUser.favorites.push({ "movie_id": movie_id, "addedAt": currentDate})
                favorites[favorites.indexOf(user)] = JSON.stringify(jsonUser)
                fs.writeFileSync('./db/favorites.txt', JSON.stringify(favorites, null, 4))
                return true
            }
        }
    }
}

module.exports = {getMovies, getFavorites, addFavorite}