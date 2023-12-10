require('dotenv').config()
const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors')
const bodyParser = require('body-parser')

const { MongoClient, ServerApiVersion } = require('mongodb');
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.g0cgl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://UnWoRthY:<password>@cluster0.g0cgl.mongodb.net/?retryWrites=true&w=majority";
// console.log(url);
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// client.connect(err => {
//   // const menuItems = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_ONE}`);
//   // const whyChooseUs = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_TWO}`);
//   // const foodOrder = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_THREE}`);
//   console.log("Database is connected");

//   app.get('/', (req, res) => {
//     res.send('Welcome to Bikroy.com backend');
//   })

//   // app.get('/profileInfo', (req, res) => {
//   // read data from here
//   // })

//   app.post('/profileInfo', (req, res) => {
//     const formData = req.body;
//     res.json(formData);
//     console.log(formData);
//   })

//   app.post('/postAds', (req, res) => {
//       const adsData = req.body;
//       res.json(adsData);
//       console.log(adsData);
//     })
// });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const postAds = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_ONE}`);
      const getProfileInfo = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_TWO}`);
      const postProfileInfo = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_THREE}`);

      app.get('/', (req, res) => {
        res.send('Welcome to Bikroy.com backend');
      })

      app.get('/getProfileInfo', (req, res) => {
        //read data from here
        getProfileInfo.find({})
            .toArray((err, result) => res.send(result))
      })

      app.post('/postProfileInfo', (req, res) => {
        // const formData = req.body;
        // res.json(formData);
        // console.log(formData);

        postProfileInfo.insertOne(req.body)
            .then(result => res.send(result))
      })

      app.post('/postAds', (req, res) => {
          // const adsData = req.body;
          // res.json(adsData);
          // console.log(adsData);

          postAds.insertOne(req.body)
            .then(result => res.send(result))
        })
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
