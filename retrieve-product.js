// Import paket MongoDB
const MongoClient = require('mongodb').MongoClient;

// Konfigurasi koneksi ke basis data MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'sibarkasid';

async function retrieveProducts() {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db("sibarkasid");
    const products = await db.collection("products").find().toArray();
    console.log(products); // menampilkan produk pada konsol
    client.close();
    return products;
  } catch (error) {
    throw new Error(`Error retrieving products: ${error}`);
  }
}

module.exports = retrieveProducts;
