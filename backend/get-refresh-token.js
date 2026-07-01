const { google } = require("googleapis");
const http = require("http");

const CLIENT = require("./credentials/oauth-client.json");

const {
  client_secret,
  client_id,
  redirect_uris
} = CLIENT.web;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPES = [
  "https://www.googleapis.com/auth/drive"
];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log("Open this URL:");
console.log(authUrl);

http.createServer(async (req, res) => {

    if (req.url.indexOf("/?code=") > -1) {

        const qs = new URL(req.url, "http://localhost:3001")
            .searchParams;

        const code = qs.get("code");

        res.end("Authorization completed.");

        const { tokens } =
            await oAuth2Client.getToken(code);

        console.log(tokens);

        process.exit();

    }

}).listen(3001);