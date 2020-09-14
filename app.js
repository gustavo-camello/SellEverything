const product = require('./modules/product');
const comment = require('./modules/comment');
const { authenticate } = require('passport');

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      Product = require('./modules/product'),
      Comment = require('./modules/comment'),
      User = require('./modules/user'),
      seedDB = require('./seeds');



// Basic setup
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Conect the db
mongoose.connect('mongodb://localhost/sell_everything', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

seedDB();

// PASSPORT CONFIGURATION
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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// -------------------------------------------

// ROUTE PAGES

// LP page
app.get('/', (req, res) => {
  res.render('landingPage')
});

// INDEX ROUTE - all products to sell page
app.get('/productsList', (req, res) => {
  Product.find({}, (err, allProducts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('products/index', {products: allProducts});
    }
  })
});

// NEW ROUTE - Show form to add a new product
app.get('/productsList/newProduct', (req, res) => {
  res.render('products/addProduct.ejs')
  
});

// CREATE ROUTE -  Add a new product
app.post('/productsList', (req, res) => {
  let name = req.body.name;
  let img = req.body.img;
  let description = req.body.description;
  let newProduct = {name: name, img: img, description: description};

  // Create new product and save to DB
  Product.create(newProduct, (err, newProduct) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('productsList');
    }
  })
});

// SHOW ROUTE - show more information about one product
app.get("/productsList/:id", (req, res) => {
  Product.findById(req.params.id).populate('comments').exec((err, foundProduct) => {
    if (err) {
      console.log(err);
    } else {
      console.log(foundProduct);
      res.render('products/moreInfoProduct', {product: foundProduct});
    }
  });
});

//  ======================
// COMMENTS ROUTE
// ========================

app.get('/productsList/:id/comments/new', isLoggedIn,  (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {product: product});
    }
  })
});

app.post('/productsList/:id/comments', isLoggedIn, (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      console.log(err);
      res.redirect('/productsList');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          product.comments.push(comment);
          product.save();
          res.redirect('/productsList/' + product._id);
        }
      })
    }
  })
});

//  ======================
// AUTHENTICATION ROUTES
// ========================

// Show the form to sign up
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle the sign up logic
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login');
}); 

app.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/productsList',
    failureRedirect: '/login'
  }), (req, res) => {
});

// Logout Route
app.get('/logout', (req, res) => {
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

// --------------------------------- SERVER LISTINING -------------------------------------
app.listen(3000, '127.0.0.1', ()=> {
  console.log("Server has started...")
});