const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const App = mongoose.model('apps');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureguest} = require('../helpers/auth');

// Apps Index
router.get('/', (req, res) => {
  App.find({status: 'public'})
    .populate('user')
    .sort({date: 'desc'})
    .then(apps => {
      res.render('apps/index', {
        apps
      })
    });
});

// Show Single App
router.get('/show/:id', (req, res) => {
  App.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(app => {
    if(app.status === 'public') {
      res.render('apps/show', {
        app
      });
    } else {
      if(req.user){
        if(req.user.id == app.user._id) {
          //double equal signs here is necessary because req.user.id is a string and story.user._id is an object that contains a key value pair
          res.render('apps/show', {
            app
          });
        } else {
          res.redirect('/apps');
        } 
      } else {
        res.redirect('/apps');
      }
    }
  });
});

// List apps from user
router.get('/user/:userId', (req, res) => {
  App.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(apps => {
      res.render('apps/index', {
        apps
      });
    });
});

// Logged in users apps
router.get('/my', (req, res) => {
  App.find({user: req.user.id})
    .populate('user')
    .then(apps => {
      res.render('apps/index', {
        apps
      });
    });
});

// Add App Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('apps/add');
});

// Edit App Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  App.findOne({
    _id: req.params.id
  })
  .then(app => {
    if(app.user != req.user.id) {
      res.redirect('/apps');
    } else {
      res.render('apps/edit', {
        app
      });
    }
  });
})

// Process Add App
router.post('/', (req, res) => {
  let allowComments;
  if(req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newApp = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

// Create App
  new App(newApp)
    .save()
    .then(app => {
      res.redirect(`/apps/show/${app.id}`);
    });
});

// Edit Form Process
router.put('/:id', (req, res) => {
  App.findOne({
    _id: req.params.id
  })
  .then(app => {
    let allowComments;
    if(req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

  //New values
  app.title = req.body.title;
  app.body = req.body.body;
  app.status = req.body.status;
  app.allowComments = allowComments;
  app.save()
    .then(app => {
      res.redirect('/dashboard');
    });
  });
});

// Delete App
router.delete('/:id', (req, res) => {
  App.deleteOne({_id: req.params.id})
    .then(() => {
      res.redirect('/dashboard');
    });
})

// Add Comment
router.post('/comment/:id', (req, res) => {
  App.findOne({
    _id: req.params.id
  })
  .then(app => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }
    
    // Add to comments array
    app.comments.unshift(newComment);
    //unshift to add at beginning

    app.save()
      .then(app => {
        res.redirect(`/apps/show/${app.id}`);
      });
  });
});

module.exports = router;