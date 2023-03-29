const MongoClient = require('mongodb').MongoClient;

// Connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'ecommerce';

// Export the retrieveAllProducts function
exports.retrieveAllProducts = function() {
  // Create a new MongoClient
  const client = new MongoClient(url, { useUnifiedTopology: true });

  // Use connect method to connect to the Server
  client.connect(function(err) {
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Get the products collection
    const productsCollection = db.collection('products');

    // Find all documents in the products collection
    productsCollection.find({}).toArray(function(err, products) {
      console.log("Found the following products:");
      console.log(products);
      client.close();
    });
  });
};
