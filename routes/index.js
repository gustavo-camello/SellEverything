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
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, ()=> {
      req.flash('success', 'Welcome' + user.username);
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
  req.flash('success', 'Logged you out');
  res.redirect('/productsList');
});

module.exports = route;