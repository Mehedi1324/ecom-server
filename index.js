const express = require('express');
const app = express();
const port = process.env.PORT || 1010;
const cors = require('cors');
require('dotenv').config();

// middleware___
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from rode js');
});

const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.KEY}@cluster0.cgyk5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('products');
    const latestCollections = database.collection('latest_collections');
    const mostSellingCollections = database.collection('most_sellings');
    const topSellingCollections = database.collection('top_selling');
    const topTrendingCollections = database.collection('top_trending');
    const cardCollection = database.collection('card_products');

    // Getting latest_collections from mongodb
    app.get('/latest_collections', async (req, res) => {
      const cursor = latestCollections.find({});
      const products = await cursor.toArray();

      res.send(products);
    });

    // Finding Products From Collection of data_________________

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const productCol =
        (await latestCollections.findOne(query)) ||
        (await mostSellingCollections.findOne(query)) ||
        (await topSellingCollections.findOne(query)) ||
        (await topTrendingCollections.findOne(query));
      res.send(productCol);
    });

    // Getting most_sellings from mongodb

    app.get('/most_selling', async (req, res) => {
      const cursor = mostSellingCollections.find({});
      const products = await cursor.toArray();

      res.send(products);
    });

    // Getting top_selling from mongodb
    app.get('/top_selling', async (req, res) => {
      const cursor = topSellingCollections.find({});
      const products = await cursor.toArray();

      res.send(products);
    });

    // Getting top_trending from mongodb
    app.get('/trending', async (req, res) => {
      const cursor = topTrendingCollections.find({});
      const products = await cursor.toArray();

      res.send(products);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('listening to the port', port);
});
