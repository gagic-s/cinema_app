const pool = require('../../db.js')
const generateId = require('../utils.js');



// get all genres
const getGenres = (req, res) => {
    pool.query("SELECT * FROM genres", (err, results) => {
        if (err) throw err;
        res.status(200).json(results.rows)
    })
}


//get single genre
const getGenreById = (req, res) => {
    const genrename = req.params.genrename;
    pool.query("SELECT * FROM genres WHERE genrename = $1", [genrename], (err, results) => {
        if (err) throw err;

        res.status(200).json(results.rows)
    })
}


// add genre
const addGenre = (req, res) => {
    const { genrename } = req.body;

        //check if name exists
         pool.query("SELECT * FROM genres WHERE genrename = $1", [genrename], (err, results) => {
        if (results.rows.length) {
            return res.send("Genre name already exist")
        }

        //add genre
        const newGenreId = generateId();
        pool.query("INSERT INTO genres (genre_id, genrename) VALUES ($1, $2)", [newGenreId, genrename], (err, results) => {
            if (err) throw err;

            res.status(201).send("Genre successfully created")
        })
    })
}

// delete genre
const deleteGenre = (req, res) => {
    const genrename = req.params.genrename;
    console.log(genrename)

        //check if name exists
         pool.query("SELECT * FROM genres WHERE genrename = $1", [genrename], (err, results) => {
        if (!results.rows.length) {
            return res.send("Genre not found")
        }

        pool.query("DELETE FROM genres WHERE genrename = $1", [genrename], (err, results) => {
        if (err) throw err
        res.status(200).send("Genre successfully deleted")
     
    })
})
}

const updateStudent = (req, res) => {
    const genrename = req.params.genrename;
    const newGenreName = req.body.genrename;
    console.log(genrename)

        //check if name exists
         pool.query("SELECT * FROM genres WHERE genrename = $1", [genrename], (err, results) => {
        if (!results.rows.length) {
            return res.send("Genre not found")
        }

        pool.query("UPDATE genres SET genrename = $1 WHERE genrename = $2", [newGenreName, genrename], (err, results) => {
        if (err) throw err
        res.status(200).send("Genre successfully updated")
     
    })
})
}

module.exports = {
    getGenres,
    getGenreById,
    addGenre,
    deleteGenre,
    updateStudent
};