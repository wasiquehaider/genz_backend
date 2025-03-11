const db = require("../config/database");

// Add a new food item
exports.addFood = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Poster file is required" });
    }
    const poster = `/uploads/${req.file.filename}`;
    const [result] = await db
      .promise()
      .query("INSERT INTO food_menu (name, price, image_url) VALUES (?, ?, ?)", [name, price, poster]);
    res.status(201).json({ message: "Food item added", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add food item" });
  }
};

// Fetch all food items
exports.getAllFood = async (req, res) => {
  try {
    const [foodItems] = await db.promise().query("SELECT * FROM food_menu");
    res.json(foodItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch food items" });
  }
};

// Update a food item
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    await db
      .promise()
      .query("UPDATE food_menu SET name = ?, price = ? WHERE id = ?", [name, price, id]);
    res.json({ message: "Food item updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update food item" });
  }
};

// Delete a food item
exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query("DELETE FROM food_menu WHERE id = ?", [id]);
    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete food item" });
  }
};
