const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/products', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const products = await Product.find({ name: { $regex: searchQuery, $options: 'i' } });
    res.render('products', { products, searchQuery });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Error displaying products' });
  }
});

module.exports = router;
