const mongoose = require('mongoose');

// SCHEMA SETUP
let productSchema = new mongoose.Schema({
  name: String,
  img: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

let Product = 

module.exports = mongoose.model("Product", productSchema);