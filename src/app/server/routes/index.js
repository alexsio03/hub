const express = require("express");
const router = express.Router();
var passport = require('passport');

function routes(app) {
    router.get('/steam', passport.authenticate('steam'), 
    function(req, res) {});

    router.get('/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
        res.redirect("/")
    });

    return router;
};

module.exports = routes;