const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
// middleware

app.use(express.json())
// const corsConfig = {
//   origin : '*' ,
//   credentials : true,
//   methods : ["GET" , "POST" , "PUT" , "PATCH" , "DELETE" , "OPTIONS"]
// }
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6rjuyq3.mongodb.net/?retryWrites=true&w=majority`;

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

    // await client.connect();
    const database1 = client.db("ProductsDB");
    const Productcollections = database1.collection("Products");
    const database2 = client.db("MyCartsDB");
    const Cartcollections = database2.collection("MyCarts");

    app.get('/productDetails', async (req, res) => {
      const cursor = Productcollections.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/productDetails', async (req, res) => {
      const user = req.body;
      console.log('new', user);
      const result = await Productcollections.insertOne(user);
      res.send(result)
    })

    // const filteredProducts = await collection.find({ category: targetCategory }).toArray();

    app.get('/poducts/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { brands: id };
      const user = await Productcollections.find(query).toArray();
      res.send(user)

    })
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id

      const query = { _id: new ObjectId(id) }
      const result = await Productcollections.findOne(query)
      res.send(result)
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const User = req.body;
      console.log(id, User);
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateProduct = {
        $set: {
          name: User.name,
          price: User.price,
          image: User.image,
          ratings: User.ratings,
          category: User.category,
          description: User.description,
          brands: User.brands,

        }
      }

      const result = await Productcollections.updateOne(filter, updateProduct, options)
      res.send(result)

    })


    app.get('/mycarts', async (req, res) => {
      const cursor = Cartcollections.find()
      const result = await cursor.toArray();
      res.send(result)
    })
    app.post('/mycarts', async (req, res) => {
      const user = req.body;

      const result = await Cartcollections.insertOne(user);
      res.send(result)
    })

    app.get('/carts/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { userid: id };
      const user = await Cartcollections.find(query).toArray();
      res.send(user)

    })

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id
      console.log('plz delete  from database', id);
      //   const query = {_id : new ObjectId(id)}
      //   const result = await usercollections.deleteOne(query)
      //   res.send(result)
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


app.get('/', (req, res) => {
  res.send('Brand Shop management server is running')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

// user
// borshonsaha1234
// password
// TLqQE4ymjG3zYyQT