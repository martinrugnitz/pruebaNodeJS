const express = require('express')
const app = express()
app.use(express.json())

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const moviesRouter = require('./routes/movies')
app.use('/movies', moviesRouter)


//app.use(middleware.errorHandler) // Error handler middleware

require('dotenv').config() // Load environment variables from .env file

const port = process.env.PORT || 3000; // Use the value from the PORT environment variable, or fallback to 3000 if not set
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});