const express = require("express");
var passport = require('passport');
var session = require('express-session');
var passportSteam = require('passport-steam');
var SteamStrategy = passportSteam.Strategy;
const router = express.Router();

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: '83B787E996D1E5DCF048B9DEE2999748'
  },
  function(identifier, profile, done) {
    User.findByOpenID({ openId: identifier }, function (err, user) {
      return done(err, user);
    });
  }
));

function routes(app) {
    router.get('/steam', passport.authenticate('steam'), 
    function(req, res) {
        // The request will be redirected to Steam for authentication, so
        // this function will not be called.
    });

    router.get('/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
        res.redirect('/')
    });

    return router;
};

module.exports = routes;