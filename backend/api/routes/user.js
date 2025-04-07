import express from "express";
import pool from "../db/poolConnection.js";

const userRouter = express.Router();

// NeonDB -> postgres

// Get all users
userRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a user by ID
userRouter.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register a new user
userRouter.post("/", async (req, res) => {
  const { firstName, lastName, email, city, zipCode, isAdmin, password } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (firstName, lastName, email, city, zipCode, isAdmin, password) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [firstName, lastName, email, city, zipCode, isAdmin, password]
    );
    res
      .status(201)
      .json({
        message: "User created successfully",
        userId: result.rows[0].id,
      });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a user by ID
userRouter.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email, city, zipCode, isAdmin, password } =
    req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET firstName = $1, lastName = $2, email = $3, city = $4, zipCode = $5, isAdmin = $6, password = $7 WHERE id = $8",
      [firstName, lastName, email, city, zipCode, isAdmin, password, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login a user
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    console.log("Login attempt for:", username);

    const isEmail = username.includes("@");
    let query = isEmail
      ? "SELECT * FROM users WHERE email = $1 AND password = $2"
      : "SELECT * FROM users WHERE username = $1 AND password = $2";

    let result = await pool.query(query, [username, password]);
    console.log("Query result rows:", result.rows?.length || 0);

    // If first attempt failed and username doesn't look like an email,
    // try querying with the email field as a fallback
    if ((!result.rows || result.rows.length === 0) && !isEmail) {
      console.log("Trying fallback with email field");
      result = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND password = $2",
        [username, password]
      );
      console.log("Fallback query result rows:", result.rows?.length || 0);
    }

    // If we still don't have a user, return invalid credentials
    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // User found, prepare response
    const user = { ...result.rows[0] };
    delete user.password; // Don't send password back to client

    return res.json({
      message: "Login successful",
      user: user,
    });
  } catch (error) {
    console.error("Database error during login:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Register a new user
userRouter.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    city,
    zip_code,
    username,
    is_admin,
    password,
  } = req.body;
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const { rows } = await pool.query(
      "INSERT INTO users (first_name, last_name, email, city, zip_code, username, is_admin, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      [
        first_name,
        last_name,
        email,
        city,
        zip_code,
        username,
        is_admin,
        password,
      ]
    );
    res.json({ message: "User created successfully", userId: rows[0].id });

    console.log("User created successfully:", rows[0].id);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;
