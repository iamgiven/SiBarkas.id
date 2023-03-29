const express = require('express');
const ejs = require('ejs');
const app = express();

// Load the retrieve-products module
const retrieveProducts = require('./retrieve-products');

// Call the retrieveAllProducts function from retrieve-products.js
retrieveProducts.retrieveAllProducts();


// untuk mengakses folder "public"
app.use(express.static('public'));


// menggunakan EJS sebagai template view engine
app.set('view engine', 'ejs');


app.get('/home', (req, res) => {
  res.render('pages/home');
});


app.get('/products', (req, res) => {
  res.render('pages/products');
})


app.get('/login', (req, res) => {
  res.render('user/login');
})


app.get('/sign-up', (req, res) => {
  res.render('user/signup');
})
  

// Menjalankan server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
