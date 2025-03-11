const express = require("express");
const upload = require("../controllers/upload");
const movieController = require("../controllers/movieth.controller");

const router = express.Router();

// Change `upload.single` to `upload.array` for multiple files
router.post("/", upload.array("poster", 5), movieController.addMovie); // Allow up to 5 images
router.get("/", movieController.getAllMovies);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;

