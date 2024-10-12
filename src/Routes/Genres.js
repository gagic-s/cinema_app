const { Router } = require('express');
const controller = require("../Controllers/Genres.js")

const router = Router();

router.get("/", controller.getGenres);
router.post("/", controller.addGenre);
router.get("/:id", controller.getGenreById);
router.delete('/:genrename', controller.deleteGenre);
router.put("/:genrename", controller.updateStudent);



module.exports = router;