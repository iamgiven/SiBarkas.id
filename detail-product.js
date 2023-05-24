const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';

async function retrieveProductById(productId) {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db("sibarkasid");

    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

    

    client.close();
    return product;
  } catch (error) {
    throw new Error(`Error retrieving products: ${error}`);
  }
}

module.exports = { retrieveProductById };
