import express from "express";
import pool from "../db/poolConnection.js";

const categoriesRouter = express.Router();

// NeonDB -> postgres

// Get all categories
categoriesRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new category
categoriesRouter.post("/", async (req, res) => {
  try {
    const { name, user_id } = req.body;

    // Handle user_id correctly
    let query;
    let params;

    if (user_id) {
      query =
        "INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *";
      params = [name, user_id];
    } else {
      query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
      params = [name];
    }

    const result = await pool.query(query, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// delete a category
categoriesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM categories WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default categoriesRouter;
