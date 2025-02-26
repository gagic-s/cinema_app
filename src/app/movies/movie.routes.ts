import { Router } from "express";
import multer from "multer";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import MovieController from "./movie.controller.js";
 

// Multer setup for memory storage (to upload directly to Cloudinary)
const storage = multer.memoryStorage(); // Store file in memory, not on the filesystem
const upload = multer({ storage: storage });

class MovieRoutes {
  router = Router();
  controller = new MovieController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @swagger
     * /movies:
     *   post:
     *     summary: Create a new movie
     *     description: Creates a new movie with the provided data, including a poster image.
     *     tags:
     *       - Movies
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the movie.
     *               originalName:
     *                 type: string
     *                 description: Original name of the movie.
     *               duration:
     *                 type: integer
     *                 description: Duration of the movie in minutes.
     *               genreNames:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: List of genre names associated with the movie.
     *               poster:
     *                 type: string
     *                 format: binary
     *                 description: The movie poster image file.
     *     responses:
     *       200:
     *         description: Successfully created a new movie
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 movie_id:
     *                   type: string
     *                   format: uuid
     *                   example: "119956d9-c6e3-47dd-a4fe-43ed9a0caa20"
     *                 name:
     *                   type: string
     *                   example: "Sandra"
     *                 originalName:
     *                   type: string
     *                   example: "Sandra"
     *                 posterImage:
     *                   type: string
     *                   format: url
     *                   example: "https://res.cloudinary.com/da4cs8h8r/image/upload/v1739955717/movie_posters/kyod7zkiuekyuzuvthjn.jpg"
     *                 posterPublicId:
     *                   type: string
     *                   example: "movie_posters/kyod7zkiuekyuzuvthjn"
     *                 duration:
     *                   type: integer
     *                   example: 55
     *                 updatedAt:
     *                   type: string
     *                   format: date-time
     *                   example: "2025-02-19T09:01:57.653Z"
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                   example: "2025-02-19T09:01:57.653Z"
     *       400:
     *         description: Invalid input data
     *       500:
     *         description: Internal server error
     */
    this.router.post("/",authMiddleware, adminMiddleware,  upload.single("poster"), this.controller.create);

    /**
     * @swagger
     * /movies:
     *   get:
     *     summary: Retrieve a list of movies
     *     tags: [Movies]
     *     parameters:
     *       - in: query
     *         name: movieName
     *         schema:
     *           type: string
     *         description: Filter movies by name
     *       - in: query
     *         name: date
     *         schema:
     *           type: string
     *           format: date
     *         description: Filter movies by date (YYYY-MM-DD)
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Limit the number of results
     *       - in: query
     *         name: offset
     *         schema:
     *           type: integer
     *           default: 0
     *         description: Offset for pagination
     *     responses:
     *       200:
     *         description: A list of movies
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/MovieResponse'
     *       500:
     *         description: Internal Server Error
     */
    this.router.get("/", this.controller.findAll);
    /**
     * @swagger
     * /movies/{id}:
     *   get:
     *     summary: Get a movie by ID
     *     description: Retrieve details of a specific movie by its ID.
     *     tags:
     *       - Movies
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The UUID of the movie
     *     responses:
     *       200:
     *         description: Successfully retrieved movie details
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Movie'
     *       404:
     *         description: Movie not found
     *       500:
     *         description: Internal server error
     */
    this.router.get("/:id", this.controller.findOne);
    /**
     * @swagger
     * /movies/{id}:
     *   put:
     *     summary: Update a movie by ID
     *     description: Updates the details of a movie using the specified movie ID.
     *     tags:
     *       - Movies
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The unique identifier of the movie to be updated.
     *         schema:
     *           type: string
     *           format: uuid
     *           example: "119956d9-c6e3-47dd-a4fe-43ed9a0caa20"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: The name of the movie.
     *               originalName:
     *                 type: string
     *                 description: The original name of the movie.
     *               duration:
     *                 type: integer
     *                 description: The duration of the movie in minutes.
     *               posterImage:
     *                 type: string
     *                 description: The URL to the poster image of the movie.
     *             required:
     *               - name
     *               - originalName
     *               - duration
     *               - posterImage
     *     responses:
     *       200:
     *         description: Successfully updated the movie
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Movie successfully updated"
     *       400:
     *         description: Bad request, invalid data provided
     *       404:
     *         description: Movie not found
     *       500:
     *         description: Internal server error
     */
    this.router.put("/:id", this.controller.update);
    /**
     * @swagger
     * /movies/{id}:
     *   delete:
     *     summary: Delete a movie by ID
     *     description: Deletes a movie from the database using the specified movie ID.
     *     tags:
     *       - Movies
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The unique identifier of the movie to be deleted.
     *         schema:
     *           type: string
     *           format: uuid
     *           example: "119956d9-c6e3-47dd-a4fe-43ed9a0caa20"
     *     responses:
     *       200:
     *         description: Successfully deleted the movie
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Movie successfully deleted"
     *       404:
     *         description: Movie not found
     *       500:
     *         description: Internal server error
     */
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new MovieRoutes().router;
