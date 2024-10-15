const { Router } = require('express');
const controller = require("../controllers/genres.js")

const router = Router();

router.get("/", controller.getGenres);
router.post("/", controller.addGenre);
router.get("/:id", controller.getGenreById);
router.delete('/:id', controller.deleteGenre);
router.put("/:id", controller.updateGenre);



module.exports = router;