const express = require("express");
const next = require("next");
var passport = require('passport');
var session = require('express-session');
var passportSteam = require('passport-steam');
var SteamStrategy = passportSteam.Strategy;

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