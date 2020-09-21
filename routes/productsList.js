const express = require('express');
const router = express.Router();
const Product = require('../modules/product');
const product = require('../modules/product');
const middleware = require('../middleware');

// INDEX ROUTE - show all products to sell page
router.get('/', (req, res) => {
  Product.find({}, (err, allProducts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('products/index', {products: allProducts});
    }
  })
});

// NEW ROUTE - Show form to add a new product
router.get('/newProduct', middleware.isLoggedIn, (req, res) => {
  res.render('products/addProduct.ejs')
  
});

// CREATE ROUTE -  Add a new product
router.post('/', middleware.isLoggedIn, (req, res) => {
  let name = req.body.name;
  let img = req.body.img;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newProduct = {name: name, img: img, description: description, author: author};


  // Create new product and save to DB
  Product.create(newProduct, (err, newProduct) => {
    if(err) {
      console.log(err);
    } else {
      console.log(newProduct);
      res.redirect('productsList');
    }
  })
});

// SHOW ROUTE - show more information about one product
router.get('/:id', (req, res) => {
  Product.findById(req.params.id).populate('comments').exec((err, foundProduct) => {
    if (err || !foundProduct) {
      req.flash('error', 'Product Not Found');
      res.redirect('back');
    } else {
      console.log(foundProduct);
      res.render('products/moreInfoProduct', {product: foundProduct});
    }
  });
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkProductOwnership, (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
      res.render('products/edit', {product: foundProduct});
  });
});

// UPDATE ROUTE
router.put('/:id', middleware.checkProductOwnership, (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body.product, (err, updatedProduct) => {
    if (err) {
      res.redirect('/productsList');
    } else {
      res.redirect('/productsList/' + req.params.id);
    }
  })
});

// DELETE ROUTE
router.delete('/:id', middleware.checkProductOwnership, (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/productsList');
    } else {
      res.redirect('/productsList');
    }
  })
})


module.exports = router;