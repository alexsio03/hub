// Import necessary dependencies
const express = require("express");
const next = require("next");
var passport = require('passport');
var session = require('express-session');
var passportSteam = require('passport-steam');
var SteamStrategy = passportSteam.Strategy;
var cors = require("cors");
var axios = require("axios");

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Check if the environment is development or production
const dev = process.env.NODE_ENV !== "production";

// Create an instance of Next.js app
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Define passport serialization and deserialization functions
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // Configure the Steam authentication strategy for passport
  passport.use(new SteamStrategy({
    returnURL: `${process.env.DOMAIN}/auth/steam/return`,
    realm: `${process.env.DOMAIN}`,
    apiKey: `${process.env.STEAM_API_KEY}`
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
  ));

  // Create an instance of the Express server
  const server = express();

  // Import and use the Steam authentication routes
  const steamRoutes = require("./routes/index.js");
  server.use(cors());
  server.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false
  }));
  server.use(passport.initialize());
  server.use(passport.session());
  server.use("/auth", steamRoutes(server));

  // Endpoint to retrieve the Steam session data
  server.get("/api/steam", (req, res) => {
    res.send(req.session);
  });

  // Proxy route to fetch Steam inventory data
  server.get('/steam-proxy/:steamid', async (req, res) => {
    try {
      console.log("got inventory")
      const url1 = `http://steamcommunity.com/inventory/${req.params.steamid}/730/2`;
      const url2 = '?l=english&count=2000';
      const url = url1 + url2; // Add the trailing slash before the query parameters

      // Fetch the Steam inventory data
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Default route handling
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  // Start the server and listen on the specified port
  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on ${PORT}`);
  });
})
.catch(ex => {
  console.error(ex.stack);
  process.exit(1);
});
