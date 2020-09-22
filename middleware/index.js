const Comment = require('../modules/comment');
const Product = require('../modules/product');
const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', "Please Login First!");
  res.redirect('/login');
};

middleware.checkProductOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Product.findById(req.params.id, (err, foundProduct) => {
      if(err || !foundProduct) {
        req.flash('error', 'Product Not Found')
        res.redirect('/productsList');
      } else {
        if (foundProduct.author.id.equals(req.user._id)){
          next();
        }else {
          req.flash('error', 'You dont have permission to do that')
          res.redirect('back')
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

middleware.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, commentFound) => {
      if(err || !commentFound) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        if (commentFound.author.id.equals(req.user._id)){
          next();
        }else {
          req.flash('error', 'You dont have permission to do that');
          res.redirect('back')
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('back');
  }
}




module.exports = middleware