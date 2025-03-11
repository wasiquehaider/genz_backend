const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieslocation.controller");
const upload = require("../controllers/upload");



router.get("/", movieController.getAllMovies);
router.post("/", upload.single("poster"), movieController.addMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
