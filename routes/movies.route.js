const express = require("express");
const upload = require("../controllers/upload");
const movieController = require("../controllers/movies.controller");

const router = express.Router();

router.post("/", upload.single("poster"), movieController.addMovie);
router.get("/", movieController.getAllMovies);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;

