const Comment = require('../modules/comment');
const Product = require('../modules/product');
const middleware = {};

middleware.checkProductOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Product.findById(req.params.id, (err, foundProduct) => {
      if(err) {
        res.redirect('/productsList');
      } else {
        if (foundProduct.author.id.equals(req.user._id)){
          next();
        }else {
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
      if(err) {
        res.redirect('back');
      } else {
        if (commentFound.author.id.equals(req.user._id)){
          next();
        }else {
          res.redirect('back')
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};


module.exports = middleware