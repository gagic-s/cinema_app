
const express = require('express');
const genreRoutes = require("./src/Routes/Genres.js")


const app = express()
app.use(express.json());

app.use('/api/v1/genres', genreRoutes)


app.listen(8000, () => console.log('Server is running on port 8000'))