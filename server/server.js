// @ts-check

import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import Database from "./db/Database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  /**
   * @type {string}
   */
  const email = req.body.email;

  /**
   * @type {string[]}
   */
  const filters = req.body.filters;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
  }

  try {
    const db = new Database();

    let result = await db.all("SELECT email FROM emails WHERE email = $1", [
      email,
    ]);

    if (result.length > 0) {
      res.status(400).json({ error: "Enter a unique email" });
      return;
    }

    const emailUUID = uuidv4();
    await db.run("INSERT INTO emails VALUES ($1, $2)", [emailUUID, email]);

    filters.forEach(async (filter) => {
      const filterUUID = uuidv4();

      await db.run("INSERT INTO filters VALUES ($1, $2, $3)", [
        filterUUID,
        emailUUID,
        filter,
      ]);
    });

    res.json({ msg: `${email} succesfully signed up` });
  } catch (err) {
    res.status(500).json({ error: err.message });
    throw err;
  }
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
