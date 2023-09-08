import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import pool from "./db/db.js";

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(cors());

app.post("/signup", async (req, res) => {
  const { email, filters } = req.body;

  try {
    const result = await pool.query("SELECT * FROM emails WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      throw new Error("Email already exists");
    }

    const emailUUID = uuidv4();
    await pool.query("INSERT INTO emails VALUES ($1, $2)", [emailUUID, email]);

    filters.forEach(async (filter) => {
      const filterUUID = uuidv4();
      await pool.query("INSERT INTO filters VALUES ($1, $2, $3)", [
        filterUUID,
        emailUUID,
        filter,
      ]);
    });

    res.json({ msg: "success" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT || 3000, () => console.log(`Server is running at ${PORT}`));
