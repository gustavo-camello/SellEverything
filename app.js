const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      flash = require('connect-flash'),
      methodOverride = require('method-override'),
      LocalStrategy = require('passport-local'),
      Product = require('./modules/product'),
      Comment = require('./modules/comment'),
      User = require('./modules/user'),
      seedDB = require('./seeds');

// ==================
// Require Routes
// ==================
const commentRoutes = require('./routes/comments'),
      productsListRoutes = require('./routes/productsList'),
      indexRoutes = require('./routes/index');

// ==================
// Basic setup
// ==================
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// ==================
// Connect To DB (mongoDB)
// ==================
// Locally
// mongoose.connect('mongodb://localhost/sell_everything', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));

// remote
mongoose.connect('mongodb+srv://gucamello:qR1JOqLdHpM2Xd8n@selleverything.ykevb.mongodb.net/SellEverything?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// Seed the database
// seedDB();


// ==================
// Passport Configuration
// ==================
app.use(require('express-session')({
  secret: "This is a node application!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ------------------------
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/productsList', productsListRoutes);
app.use('/productsList/:id/comments', commentRoutes);


// --------------------------------- SERVER LISTINING -------------------------------------
app.listen(process.env.PORT || 3000, '127.0.0.1', ()=> {
  console.log("Server has started...")
});


