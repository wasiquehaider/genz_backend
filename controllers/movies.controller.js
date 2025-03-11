const db = require("../config/database"); 
const path = require("path");
// Get all trending movies
exports.getAllMovies = async (req, res) => {
  try {
    const [movies] = await db.promise().query("SELECT * FROM trending_movies");
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const { title, director, actors, description, youtube_trailer } = req.body;

    // Ensure that the poster file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Poster file is required" });
    }

    // Get the poster path
    const poster = `/uploads/${req.file.filename}`;

    // Insert the movie into the database
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO trending_movies (title, poster, director, actors, description, youtube_trailer) VALUES (?, ?, ?, ?, ?, ?)",
        [title, poster, director, actors, description, youtube_trailer]
      );

    // Respond with success
    res
      .status(201)
      .json({ message: "Movie added successfully", id: result.insertId });
  } catch (error) {
    console.error("Error in addMovie controller:", error);
    res.status(500).json({ error: "Failed to add movie" });
  }
};


// Update a movie
exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, poster, director, actors, description, youtube_trailer } =
    req.body;
  try {
    await db
      .promise()
      .query(
        "UPDATE trending_movies SET title = ?, poster = ?, director = ?, actors = ?, description = ?, youtube_trailer = ? WHERE id = ?",
        [title, poster, director, actors, description, youtube_trailer, id]
      );
    res.json({ message: "Movie updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update movie" });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query("DELETE FROM trending_movies WHERE id = ?", [id]);
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete movie" });
  }
};
