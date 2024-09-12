const express = require("express");
const session = require("express-session");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET
}));

app.set("view engine", "ejs");

// home
app.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});

// login 
app.get("/auth/google", (req, res) => {
  const redirectUri = encodeURIComponent("http://localhost:3000/auth/google/callback");
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&scope=email%20profile`;
  res.redirect(authUrl);
});

// callback 
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;
  console.log("code: " ,code)
  if (!code) {
    return res.redirect("/auth/failure");
  }

  try {
    // exchange auth code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:3000/auth/google/callback",
      grant_type: "authorization_code",
    });

    const accessToken = data.access_token;
    console.log("access token: " ,accessToken)

    // user profile
    const { data: profile } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // user stored
    req.session.user = profile;

    res.redirect("/");
  } catch (error) {
    console.error("Error exchanging code for token:", error.message);
    res.redirect("/auth/failure");
  }
});

// failure
app.get("/auth/failure", (req, res) => {
  res.send("Failed to authenticate.");
});

// logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("App is running on http://localhost:3000");
});
