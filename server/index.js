const express = require("express");
const next = require("next");
var passport = require('passport');
var session = require('express-session');
var passportSteam = require('passport-steam');
var SteamStrategy = passportSteam.Strategy;
var cors = require("cors")
var axios = require("axios")

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: '83B787E996D1E5DCF048B9DEE2999748'
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
  ));

  const server = express();
  const steamRoutes = require("./routes/index.js");
  server.use(cors())

  server.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false}));

  server.use(passport.initialize());
  server.use(passport.session());

  server.use("/auth", steamRoutes(server));

  server.get("/api/steam", (req, res) => {
    res.send(req.session);
  });

  server.get('/steam-proxy/:steamid', async (req, res) => {
    try {
      const url1 = `http://steamcommunity.com/inventory/${req.params.steamid}/730/2`;
      const url2 = '?l=english&count=2000';
      const url = url1 + url2; // Add the trailing slash before the query parameters

      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  server.get('/fb-proxy', async (req, res) => {
    try {
      const { downloadURL } = req.query;

      // Fetch the JSON file using the download URL
      const response = await axios.get(downloadURL);

      // Set the appropriate headers for the response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="downloaded.json"');

      // Pass back the JSON file
      res.send(response.data);
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
});

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on ${PORT}`);
  });
})
.catch(ex => {
  console.error(ex.stack);
  process.exit(1);
});