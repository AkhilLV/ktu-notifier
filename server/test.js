// import pkg from "sqlite3";
// const db = new pkg.Database("./db/ktu.db");

// db.all(
//   "SELECT * FROM notification_counter WHERE counter_id = ?",
//   [1],
//   (error, rows) => {
//     console.log(rows);
//   }
// );

// console.log("this is a test");

// console.log(result);

// tutorial

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success");
  }, 2000);
});

const res = await p;
console.log(res);
