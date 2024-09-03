const express = require('express')
const app = express()
app.use(express.json())


require('dotenv').config() // Load environment variables from .env file

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const moviesRouter = require('./routes/movies')
app.use('/movies', moviesRouter)

const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler) // Error handler middleware

const port = process.env.PORT || 3000; // Use the value from the PORT environment variable, or fallback to 3000 if not set
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})