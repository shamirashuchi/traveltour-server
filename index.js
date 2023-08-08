const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g2hlfdf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const travelCollection  =  client.db('Traveldb').collection('menu');
    const CommunityCollection  =  client.db('Traveldb').collection('Community');
    const requestCollection  =  client.db('Traveldb').collection('request');


    app.get('/menu', async(req,res) =>{
        const result = await travelCollection.find().toArray();
        res.send(result);
    })

    app.get('/community', async(req,res) =>{
      const result = await CommunityCollection.find().toArray();
      res.send(result);
  })

  app.get('/req', async(req,res) =>{
    const result = await requestCollection.find().toArray();
    res.send(result);
})

    //client to server
    app.post('/item',async(req,res) =>{
      const newpost = req.body;
      console.log(newpost);
      //server to database (database result dibe)
      const result = await travelCollection.insertOne(newpost);
      //send the result to the client
      res.send(result);
    })


    //client to server
    app.post('/community',async(req,res) =>{
      const newCommunity = req.body;
      console.log(newCommunity);
      //server to database (database result dibe)
      const result = await CommunityCollection.insertOne(newCommunity);
      //send the result to the client
      res.send(result);
    })


    app.post('/req', async(req,res) => {
      const requested = req.body;
      console.log(requested);
      const result = await requestCollection.insertOne(requested);
      res.send(result);
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('travel more')
})

app.listen(port, () =>{
    console.log(`Seat is booking  on port ${port}`);
})