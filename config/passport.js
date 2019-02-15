const GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongoose = require('mongoose');
const keys = require('./keys');

// Load user model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
      //proxy property needed for heroku
    }, (accessToken, refreshToken, profile, done) => {
      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

      // Check for existing user
      User.findOne({
        googleID: profile.id
      }).then(user => {
        const newUser = {
          googleID: profile.id,
          firstName: profile.name.giveName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image
        }

        //NOTE: make sure user has owner: true property in order to upload edit and remove apps on the website

        // Return user
        if(user) {
          done(null, user);
          //the user returned here gets set as res.locals.users global variable in app.js
        } else {
        // Create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}