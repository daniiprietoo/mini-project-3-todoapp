import express from "express";
import pool from "../db/poolConnection.js";

const todosRouter = express.Router();

// NeonDB -> postgres

// Get all todos
todosRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new todo
todosRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      due_date,
      priority,
      status,
      category_id,
    } = req.body;

    // If category_id is empty string or null, use NULL in the query
    let query;
    let params;

    if (
      category_id === "" ||
      category_id === null ||
      category_id === undefined
    ) {
      // Use NULL for category_id
      query =
        "INSERT INTO todos (title, description, due_date, priority, status, category_id) VALUES ($1, $2, $3, $4, $5, NULL) RETURNING *";
      params = [title, description, due_date, priority, status];
    } else {
      // Use the provided category_id
      query =
        "INSERT INTO todos (title, description, due_date, priority, status, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
      params = [
        title,
        description,
        due_date,
        priority,
        status,
        category_id,
      ];
    }

    const { rows } = await pool.query(query, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Delete todo
todosRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM todos WHERE id = $1", [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a todo
todosRouter.put("/:id", async (req, res) => {
  const todoId = req.params.id;
  const { title, description, due_date, priority, status, category_id } =
    req.body;

  try {
    let query;
    let params;

    if (
      category_id === "" ||
      category_id === null ||
      category_id === undefined
    ) {
      // Set category_id to NULL
      query =
        "UPDATE todos SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, category_id = NULL WHERE id = $6 RETURNING *";
      params = [title, description, due_date, priority, status, todoId];
    } else {
      // Use the provided category_id
      query =
        "UPDATE todos SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, category_id = $6 WHERE id = $7 RETURNING *";
      params = [
        title,
        description,
        due_date,
        priority,
        status,
        category_id,
        todoId,
      ];
    }

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

export default todosRouter;
