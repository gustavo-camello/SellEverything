const express = require('express');
const router = express.Router({mergeParams: true});
const Product = require('../modules/product');
const Comment = require('../modules/comment');
const middleware = require('../middleware');

// Comments NEW
router.get('/new', middleware.isLoggedIn,  (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {product: product});
    }
  })
});

// Comments CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      console.log(err);
      res.redirect('/productsList');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong');
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          product.comments.push(comment);
          product.save();
          console.log(comment);
          req.flash('success', 'Successfully added comment');
          res.redirect('/productsList/' + product._id);
        }
      })
    }
  })
});

// Show the form the edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership,  (req, res) => {
  Product.findById(req.params.id, (err, productFound) => {
    if(err || !productFound) {
      req.flash('error', 'Product Not Found');
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log(err)
      }else {
        res.render('comments/edit', {product_id: req.params.id, comment: foundComment});
      }
    })
  })  
});

// Update the comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/productsList/' + req.params.id);
    }
  })
});

//  Delete a comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted')
      res.redirect('/productsList/' + req.params.id);
    }
  })
});


module.exports = router;