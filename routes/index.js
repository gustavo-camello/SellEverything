const express = require('express');
const route = express.Router();
const passport = require('passport');
const User = require('../modules/user');

// Root Route
route.get('/', (req, res) => {
  res.render('landingPage')
});


//  ======================
// AUTHENTICATION ROUTES
// ========================

// Show the form to sign up
route.get('/register', (req, res) => {
  res.render('register');
});

// Handle the sign up logic
route.post('/register', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, ()=> {
      res.redirect('/productsList');
    })
  })
});

// Show login form
route.get('/login', (req, res) => {
  res.render('login');
}); 

route.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/productsList',
    failureRedirect: '/login'
  }), (req, res) => {
});

// Logout Route
route.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/productsList');
});

// Middleware - check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = route;