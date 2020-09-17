const mongoose = require('mongoose');

// SCHEMA SETUP
let productSchema = new mongoose.Schema({
  name: String,
  img: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

let Product = 

module.exports = mongoose.model("Product", productSchema);