require("dotenv").config();

const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const app = express();

const credentials = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "credentials", "oauth-client.json")
  )
);

const { client_id, client_secret, redirect_uris } = credentials.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// URL สำหรับ Login
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: [
    "https://www.googleapis.com/auth/drive"
  ]
});

console.log("\n============================");
console.log("เปิด URL นี้ใน Browser");
console.log(authUrl);
console.log("============================\n");

// รับ Callback
app.get("/oauth2callback", async (req, res) => {

  try {

    const { code } = req.query;

    const { tokens } =
      await oauth2Client.getToken(code);

    console.log("\n=========== TOKEN ===========");
    console.log(tokens);
    console.log("=============================\n");

    res.send(`
      <h2>Success</h2>
      <p>Refresh Token ถูกสร้างแล้ว</p>
      <p>กลับไปดูที่ Terminal</p>
    `);

    process.exit();

  } catch (err) {

    console.error(err);

    res.send(err.message);

  }

});

app.listen(3000, () => {

  console.log("OAuth Server Running");
  console.log("Waiting Callback...");

});