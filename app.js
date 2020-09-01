const express = require('express');
const app = express();

app.set('view engine', 'ejs');


// ROUTE PAGES
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/productsList', (req, res) => {
  let products = [
    {name: 'Television', img: 'https://images.pexels.com/photos/2251206/pexels-photo-2251206.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'PS4', img: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&h=350'},
    {name: 'Toaster', img: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&h=350'}
  ]
  
  res.render('productsList', {products: products});
})













// SERVER LISTINING
app.listen(3000, process.env.PORT, ()=> {
  console.log("Server has started...")
})