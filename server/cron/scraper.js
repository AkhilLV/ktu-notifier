import * as cheerio from "cheerio";
import fs from "fs/promises";
import axios from "axios";

import pool from "../db/db.js";

import sendEmails from "./email.js";

const getNotifications = (noOfNotifications = 0, $rows) => {
  const notifications = [];

  for (let i = 0; i <= noOfNotifications; i++) {
    const currentNofification = {};

    const dateString = $rows.eq(i).find("td label.news-date").text();

    // Mon Jul 31 00:00:00 IST 2023
    const day = dateString.slice(8, 10);
    const month = dateString.slice(4, 7);
    const year = dateString.slice(24, 28);

    console.log(`${day} ${month} ${year}`); // Output: 1 August 2023

    // do not remove comment, the html returned is not consistent
    // const month = $rows.eq(i).find("td b:first").text();
    // const day = $rows.eq(i).find("td label.news-date").text();
    // const year = $rows.eq(i).find("td strong").text();

    currentNofification.date = `${month} ${day}, ${year}`;

    currentNofification.title = $rows
      .eq(i)
      .find("td:nth(1) b:first")
      .text()
      .replace(/(\r\n|\n|\r)/gm, " ") // remove new lines
      .trimEnd();

    currentNofification.link =
      $rows.eq(i).find("td:nth(1) a").attr("href") || 0;

    notifications.push(currentNofification);
  }

  return notifications;
};

async function main() {
  let currentNoOfNotifications;
  let newNoOfNotifications;

  const res = await pool.query(
    "SELECT counter FROM notification_counter WHERE counter_id = 1"
  );
  currentNoOfNotifications = res.rows[0].counter;

  let HTML;
  try {
    console.log("Fetching website");
    HTML = await axios.get("https://ktu.edu.in/eu/core/announcements.htm");
  } catch (err) {
    console.log(err);
  }
  // const HTML = await fs.readFile("./test.html", { encoding: "utf16le" });

  const $ = cheerio.load(HTML.data); // replace with HTML when testing with test.html

  const $rows = $("tr");
  newNoOfNotifications = $rows.length;

  console.log(currentNoOfNotifications, newNoOfNotifications);

  if (currentNoOfNotifications === newNoOfNotifications) {
    console.log("No new notifications");
    return;
  }

  // pool.query(
  //   "UPDATE notification_counter SET counter = $1 WHERE counter_id = 1",
  //   [newNoOfNotifications]
  // );

  const noOfNotificationsToFetch =
    newNoOfNotifications - currentNoOfNotifications;

  const notifications = getNotifications(noOfNotificationsToFetch, $rows);
  sendEmails(notifications);
}

main();
