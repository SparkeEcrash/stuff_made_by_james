module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  },
  ensureGuest: function(req, res, next) {
    if(req.isAuthenticated()) {
      // res.redirect('/dashboard');
      res.redirect('/apps');
    } else {
      return next();
    }
  }
}