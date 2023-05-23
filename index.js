const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6umtwj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // client.connect();

    const toyCollection = client.db("toyDB").collection("toy");

    //
    app.get("/addtoys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      console.log(req.query.email);
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });
    //

    app.get("/addtoys/:category", async (req, res) => {
      const category = req.params.category;
      const result = await toyCollection.find({ category: category }).toArray();
      res.send(result);
    });
    // Create single data
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });
    // details
    app.get("/details", async (req, res) => {
      const cursor = toyCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete
    app.delete("/addtoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });
    // Post
    app.post("/addtoys", async (req, res) => {
      const newToys = req.body;
      console.log(newToys);
      const result = await toyCollection.insertOne(newToys);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await
    // client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("cooking toy is running");
});

app.listen(port, () => {
  console.log(`cooking toy is running on port: ${port}`);
});
