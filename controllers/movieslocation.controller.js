const db = require("../config/database");

// Get all movies with locations
exports.getAllMovies = async (req, res) => {
  try {
    const [movies] = await db
      .promise()
      .query("SELECT * FROM all_movies_location");

    const [locations] = await db
      .promise()
      .query("SELECT * FROM movie_locations");

    const result = movies.map((movie) => ({
      ...movie,
      locations: locations
        .filter((loc) => loc.movie_id === movie.id)
        .map((loc) => loc.name),
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};


// Add a new movie with image upload
exports.addMovie = async (req, res) => {
  try {
    const { title, description, category, locations } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const image = `/uploads/${req.file.filename}`; // Construct file path

    // Insert movie data
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO all_movies_location (title, description, category, image) VALUES (?, ?, ?, ?)",
        [title, description, category, image]
      );

    const movieId = result.insertId;

    // Insert locations
    if (locations && Array.isArray(locations)) {
      const locationQueries = locations.map((name) =>
        db.promise().query(
          "INSERT INTO movie_locations (movie_id, name) VALUES (?, ?)",
          [movieId, name]
        )
      );
      await Promise.all(locationQueries);
    }

    res.status(201).json({ message: "Movie added successfully", id: movieId });
  } catch (error) {
    console.error("Error in addMovie:", error);
    res.status(500).json({ error: "Failed to add movie" });
  }
};


// Update a movie
exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, image, locations } = req.body;

  try {
    // Update movie data
    await db
      .promise()
      .query(
        "UPDATE all_movies_location SET title = ?, description = ?, category = ?, image = ? WHERE id = ?",
        [title, description, category, image, id]
      );

    // Update locations
    if (locations && Array.isArray(locations)) {
      // Delete existing locations
      await db
        .promise()
        .query("DELETE FROM movie_locations WHERE movie_id = ?", [id]);

      // Insert new locations
      const locationQueries = locations.map((name) =>
        db.promise().query(
          "INSERT INTO movie_locations (movie_id, name) VALUES (?, ?)",
          [id, name]
        )
      );
      await Promise.all(locationQueries);
    }

    res.json({ message: "Movie updated successfully" });
  } catch (error) {
    console.error("Error in updateMovie:", error);
    res.status(500).json({ error: "Failed to update movie" });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete movie and associated locations
    await db.promise().query("DELETE FROM movie_locations WHERE movie_id = ?", [id]);
    await db.promise().query("DELETE FROM all_movies_location WHERE id = ?", [id]);

    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMovie:", error);
    res.status(500).json({ error: "Failed to delete movie" });
  }
};
