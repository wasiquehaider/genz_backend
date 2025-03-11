const express = require("express");
const upload = require("../controllers/upload"); // Ensure this is correctly implemented
const foodController = require("../controllers/food.controller"); // Import your food controller

const router = express.Router();

// POST route to add a food item
router.post("/", upload.single("poster"), foodController.addFood);

// GET route to fetch all food items
router.get("/", foodController.getAllFood);

// PUT route to update a food item by ID
router.put("/:id", foodController.updateFood);

// DELETE route to delete a food item by ID
router.delete("/:id", foodController.deleteFood);

module.exports = router;
