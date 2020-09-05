const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

let products = [
  {name: 'Television', img: 'https://images.pexels.com/photos/2251206/pexels-photo-2251206.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'PS4', img: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'Toaster', img: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'Television', img: 'https://images.pexels.com/photos/2251206/pexels-photo-2251206.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'PS4', img: 'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'Television', img: 'https://images.pexels.com/photos/2251206/pexels-photo-2251206.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'PS4', img: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'Television', img: 'https://images.pexels.com/photos/2251206/pexels-photo-2251206.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'PS4', img: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'Television', img: 'https://images.pexels.com/photos/2251206/pexels-photo-2251206.jpeg?auto=compress&cs=tinysrgb&h=350'},
  {name: 'PS4', img: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&h=350'},
]

// ROUTE PAGES
app.get('/', (req, res) => {
  res.render('index')
});

app.get('/productsList', (req, res) => {
 res.render('productsList', {products: products});
});

app.get('/productsList/newProduct', (req, res) => {
  res.render('addProduct.ejs')
});

app.post('/productsList', (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let newProduct = {name: name, img: image};
  products.push(newProduct);

  res.redirect('/productsList');
});


// SERVER LISTINING
app.listen(3000, '127.0.0.1', ()=> {
  console.log("Server has started...")
});