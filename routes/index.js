const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const App = mongoose.model('apps');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  console.log(res.locals.user);
  App.find({user:req.user.id})
    .then(apps => {
      res.render('index/dashboard', {
        apps
      });
    });
});

router.get('/about', (req, res) => {
  res.render('index/about');
})

module.exports = router;