const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
  //information to request from google after authentication passes
}));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }), (req, res) => {
    // Successful authentication, redirect home
    // res.redirect('/dashboard');
    res.redirect('/apps');
  }
);

router.get('/verify', (req, res) => {
  if(req.user) {
    console.log(req.user);
  } else {
    console.log('Not Auth');
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;