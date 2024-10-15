import { Router } from "express";
import * as controller from "../controllers/genres.js";

const router = Router();

router.get("/", controller.getGenres);
router.post("/", controller.addGenre);
router.get("/:id", controller.getGenreById);
router.delete("/:id", controller.deleteGenre);
router.put("/:id", controller.updateGenre);

export default router;
