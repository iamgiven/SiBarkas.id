const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

async function retrieveUploadByUsername(username) {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db("sibarkasid");

    const user = await db.collection("users").findOne({ username: username });
    const uploadedProducts = user.uploaded || [];

    let products = [];
    if (uploadedProducts.length > 0) {
      const productIds = uploadedProducts.map(function(product) {
        return product.productId;
      });
    
      products = await db.collection("products").find({ _id: { $in: productIds }}).toArray();
    }

    client.close();
    return products;
  } catch (error) {
    throw new Error(`Error retrieving uploaded products: ${error}`);
  }
}

module.exports = retrieveUploadByUsername;
