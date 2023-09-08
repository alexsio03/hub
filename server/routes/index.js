// Import necessary dependencies
const express = require("express");
const router = express.Router();
var passport = require('passport');

// Define the routes function that takes an app parameter
function routes(app) {
    // Define a route for Steam authentication
    router.get('/steam', passport.authenticate('steam'), function(req, res) {});

    // Define a route for the Steam authentication callback
    router.get('/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), function (req, res) {
        res.redirect("/steamlogin");
    });

    // Return the router
    return router;
}

// Export the routes function to be used by other modules
module.exports = routes;
