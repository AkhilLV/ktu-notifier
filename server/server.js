// @ts-check

import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import {
  getEmails,
  insertEmail,
  insertFilter,
  closeDatabase,
} from "./db/db.js";

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
    /**
     * @type {Object[]}
     */
    let result = await getEmails(email);

    if (result.length > 0) {
      res.status(400).json({ error: "Enter a unique email" });
      return;
    }

    const emailUUID = uuidv4();
    await insertEmail(emailUUID, email);

    filters.forEach(async (filter) => {
      const filterUUID = uuidv4();

      await insertFilter(filterUUID, emailUUID, filter);
    });

    res.json({ msg: `${email} succesfully signed up` });
  } catch (err) {
    res.status(500).json({ error: err.message });
    throw err;
  }
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
