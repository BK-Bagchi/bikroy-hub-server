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

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const postAds = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_ONE}`);
      const profileInfo = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_TWO}`);
      // const profileInfo = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_THREE}`);

      app.get('/', (req, res) => {
        res.send('Welcome to Bikroy.com backend');
      })

      app.get('/getProfileInfo', async (req, res) => {
        try {
          const documents = await profileInfo.find({}).toArray();
          res.send(documents);
        } catch (error) {
          console.error('Error fetching profile info:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      app.get('/getAdsInfo', async (req, res) => {
        try {
          const documents = await postAds.find({}).limit(5).toArray();
          res.send(documents);
        } catch (error) {
          console.error('Error fetching profile info:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    
      app.post('/postProfileInfo', (req, res) => {
        // console.log(req.body);
        profileInfo.insertOne(req.body)
            .then(result => res.send(result))
      })

      app.post('/postAds', (req, res) => {
          // console.log(req.body);
          postAds.insertOne(req.body)
          .then(result => res.send(result))
        })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
