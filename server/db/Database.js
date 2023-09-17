// @ts-check
// Wrapper around the sqlite3 library

import sqlite3 from "sqlite3";

class Database {
  constructor() {
    this.db = new sqlite3.Database("./db/ktu.db");
  }

  /**
   * @param {string} query
   * @param {string[]} params
   */
  all(query, params) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (error, rows) => {
        if (error) {
          reject(error);
        }

        resolve(rows);
      });
    });
  }

  /**
   * @param {string} query
   * @param {string[]} params
   */
  run(query, params) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (err) => {
        if (err) {
          reject(err);
        }

        resolve({ msg: "Operation Succesful" });
      });
    });
  }

  close() {
    this.db.close();
  }
}

export default Database;
