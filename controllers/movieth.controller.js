const db = require("../config/database");

// Add a new movie
exports.addMovie = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO moviesth (title, description, category, location, images) VALUES (?, ?, ?, ?, ?)",
        [title, description, category, location, JSON.stringify(imageUrls)]
      );
    res.status(201).json({ message: "Movie added", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add movie" });
  }
};

// Fetch all movies with proper images array
exports.getAllMovies = async (req, res) => {
  try {
    const [movies] = await db.promise().query("SELECT * FROM moviesth");
    movies.forEach((movie) => {
      // Flatten nested arrays if they exist
      if (typeof movie.images === "string") {
        movie.images = JSON.parse(movie.images).flat();
      }
    });
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};


// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, location } = req.body;
    await db
      .promise()
      .query(
        "UPDATE moviesth SET title = ?, description = ?, category = ?, location = ? WHERE id = ?",
        [title, description, category, location, id]
      );
    res.json({ message: "Movie updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update movie" });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query("DELETE FROM moviesth WHERE id = ?", [id]);
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete movie" });
  }
};
