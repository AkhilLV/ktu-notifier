import dotenv from "dotenv";

dotenv.config();

import { google } from "googleapis";
import nodemailer from "nodemailer";
import pool from "../db/Database.js";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

const res = await pool.query("SELECT id, email FROM emails");
const emailList = res.rows;

// a function called sendEmails SHOULD send emails. Change the logic of filtering to somplace else

const sendEmails = async (notifications) => {
  for (const email of emailList) {
    const res = await pool.query(
      "SELECT filter FROM filters WHERE email_id = $1",
      [email.id]
    );

    const filters = res.rows.map((row) => row.filter);

    const filteredNotifications = notifications.filter((notification) => {
      for (const filter of filters) {
        if (notification.title.toLowerCase().includes(filter.toLowerCase())) {
          return true;
        }
      }
    });

    if (filteredNotifications.length === 0) {
      console.log("No new notifications for", email.email);
      continue;
    }
    console.log(filteredNotifications);

    const HTML = `
    <h1>New Notifications</h1>
    <ul>
      ${filteredNotifications
        .map(
          (notification) => `
        <li>
          <p>Date: ${notification.date}</p>
          <p>Title: ${notification.title}</p>
          <p><a href="https://ktu.edu.in${notification.link}">Link to notification</a></p>
        </li>
      `
        )
        .join("")}
    </ul>`;

    const emailOptions = {
      from: process.env.EMAIL,
      to: email.email,
      subject: "New Notification",
      text: JSON.stringify(notifications),
      html: HTML,
    };

    console.log("Sending Mail" + ` to ${email.email}`);
    // sendEmail(emailOptions);
  }
};

export default sendEmails;
