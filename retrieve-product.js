const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/sibarkasid';
const dbName = 'sibarkasid';

function retrieveProducts() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, client) {
      if (err) reject(err);

      const db = client.db(dbName);
      console.log('Database connected successfully');

      db.collection('products').find({}).toArray(function(err, products) {
        if (err) reject(err);

        client.close();

        resolve(products);
      });
    });
  });
}

module.exports = retrieveProducts;
