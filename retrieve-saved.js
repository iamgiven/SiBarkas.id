// Import paket MongoDB
const MongoClient = require('mongodb').MongoClient;

// Konfigurasi koneksi ke basis data MongoDB
const url = 'mongodb://localhost:27017';

async function retrieveProductsByUsername(username) {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db("sibarkasid");

    // query untuk mengambil data produk yang disimpan oleh user dengan nama username
    const user = await db.collection("users").findOne({ username: username });
    const savedProducts = user.saved || [];

    const productIds = savedProducts.map(function(product) {
      return product.productId;
    });
      
    const products = await db.collection("products").find({ _id: { $in: productIds }}).toArray();

    client.close();
    return products;
  } catch (error) {
    throw new Error(`Error retrieving saved products: ${error}`);
  }
}

module.exports = retrieveProductsByUsername;
