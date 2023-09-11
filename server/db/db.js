// @ts-check
// Wrappers around the sqlite3 library

import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./db/ktu.db");

/**
 * @param {string} email
 */
export const getEmails = (email) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM emails WHERE email = ?", [email], (error, rows) => {
      if (error) {
        reject(error);
      }

      resolve(rows);
    });
  });
};

/**
 * @param {string} emailUUID
 * @param {string} email
 */
export const insertEmail = (emailUUID, email) => {
  console.log(emailUUID, email);
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO emails VALUES (?, ?)", [emailUUID, email], (err) => {
      if (err) {
        reject(err);
      }

      resolve("Email Inserted");
    });
  });
};

/**
 * @param {string} filterUUID
 * @param {string} emailUUID
 * @param {string} filter
 */
export const insertFilter = (filterUUID, emailUUID, filter) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO filters VALUES (?, ?, ?)",
      [filterUUID, emailUUID, filter],
      (err) => {
        if (err) {
          reject(err);
        }

        resolve("Filter Inserted");
      }
    );
  });
};

export const closeDatabase = () => {
  db.close();
};
