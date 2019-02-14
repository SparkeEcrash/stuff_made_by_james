const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load Models
require('/models/User');
require('./models/App');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const apps = require('./routes/apps');

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

const app = express(); 

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Method Override Middleware
app.use(methodOverride('_method'));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  // set Handlebars Helpers to enable use in handlebar files in view
  helpers: {
    truncate,
    stripTags,
    formDate,
    select,
    editIcon
  },
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session ({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//passport.session() requires express session

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  //if user is authenticated and has successfully passed through assport authentication, the user object from passport google oauth 2.0 thatis inside req.user is stored into a global response variable called user
  next()
})

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/apps', apps);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});