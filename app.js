const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      Product = require('./modules/product'),
      seedDB = require('./seeds');



// Basic setup
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Conect the db
mongoose.connect('mongodb://localhost/sell_everything', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

seedDB();

// -------------------------------------------

// ROUTE PAGES

// INDEX page
app.get('/', (req, res) => {
  res.render('landingPage')
});

// all products to sell page
app.get('/productsList', (req, res) => {
  Product.find({}, (err, allProducts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {products: allProducts});
    }
  })
});

// Show form to add a new product
app.get('/productsList/newProduct', (req, res) => {
  res.render('addProduct.ejs')
  
});

// Add a new product
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
      res.redirect("productsList");
    }
  })
});

// show more information about one product
app.get("/productsList/:id", (req, res) => {
  Product.findById(req.params.id).populate("comments").exec((err, foundProduct) => {
    if (err) {
      console.log(err);
    } else {
      console.log(foundProduct);
      res.render("moreInfoProduct", {product: foundProduct});
    }
  });

});


// SERVER LISTINING
app.listen(3000, '127.0.0.1', ()=> {
  console.log("Server has started...")
});