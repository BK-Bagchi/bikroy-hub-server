require('dotenv').config()
const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors')
const bodyParser = require('body-parser')

const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');
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

const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = process.env.SSL_STORE_ID
const store_passwd = process.env.SSL_STORE_PASSWORD
const is_live = false //true for live, false for sandbox


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const postAds = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_ONE}`);
    const profileInfo = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_TWO}`);
    const placedOrders = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_THREE}`);

    app.get('/', (req, res) => {
      res.send('Welcome to Bikroy.com backend');
    })

    app.get('/getProfileInfo', async (req, res) => {
      try {
        const email = req.query.userEmail; 
        const documents = await profileInfo.find({ email }).toArray();
        res.send(documents);
      } catch (error) {
        console.error('Error fetching profile info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/getAdsInfo', async (req, res) => {
      try {
        const documents = await postAds.find().toArray();
        res.send(documents);
      } catch (error) {
        console.error('Error fetching ads info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/getOrdersInfo', async (req, res) => {
      try {
        const documents = await placedOrders.find().toArray();
        res.send(documents);
      } catch (error) {
        console.error('Error fetching ads info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/getPostedAdsByAnUser', async (req, res) => {
      try {
        const userEmail = req.query.userEmail;
        const user = await postAds.findOne({ userEmail });
        if (user) {
          // If the user is found, retrieve their posted ads
          const userAds = await postAds.find({ userEmail }).toArray();
          res.json({ user, userAds });
        } else {
          // If the user is not found, send an appropriate response
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        console.error('Error fetching user and ads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    app.get('/editPostedAdsByAnUser', async (req, res) => {
      try {
        const { userEmail, _id } = req.query;
        const user = await postAds.findOne({ userEmail });
        if (user) {
          // If the user is found, retrieve their posted ads
          const userAds = await postAds.find({ userEmail }).toArray();
          const editableAd= userAds.filter(add=> add._id == _id)
          res.json({ editableAd });
        } else {
          // If the user is not found, send an appropriate response
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        console.error('Error fetching user and ads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/ordersByAnUser', async (req, res) => {
      try {
        const userEmail = req.query.userEmail;
        const userOrders = await placedOrders.find({ customerInfo: userEmail }).toArray();
    
        if (userOrders.length > 0) {
          res.json({ userOrders });
        } else {
          res.status(404).json({ error: 'No orders found for the user' });
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/adsByAnUser', async (req, res) => {
      try {
        const userEmail = req.query.userEmail;
        const userAds = await postAds.find({ userEmail: userEmail }).toArray();
    
        if (userAds.length > 0) {
          res.json({ userAds });
        } else {
          res.status(404).json({ error: 'No orders found for the user' });
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.put('/updateAds', async (req, res) => {
      try {
        const adId = req.query.adId;
        const updatedAdData = req.body;
        const objectId = new ObjectId(adId);
        delete updatedAdData._id;
    
        const result = await postAds.updateOne({ _id: objectId }, { $set: updatedAdData });
        if (result.matchedCount === 1) {
          res.status(200).json({ message: 'Ad updated successfully' });
        } else {
          res.status(404).json({ message: 'Ad not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    app.post('/deleteAds', async (req, res) => {
      try {
        const deleteAdId = req.body.adId;
        const objectId = new ObjectId(deleteAdId);
    
        const result = await postAds.deleteOne({ _id: objectId });
        if (result.deletedCount > 0) {
          const placedOrdersResult = await placedOrders.deleteMany({ productId: deleteAdId });
          if (placedOrdersResult.deletedCount > 0) {
            res.status(200).json({ message: 'Ad and related orders deleted successfully' });
          } else {
            res.status(200).json({ message: 'Ad deleted, but no related orders found' });
          }
        } else {
          res.status(404).json({ message: 'Ad not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    app.post('/userLogin', async (req, res) => {
      try {
          const { displayName, email, photoURL } = req.body;
          const existingUser = await profileInfo.findOne({ email });
  
          if (existingUser) {
              res.status(200).json({ message: 'Login successful' });
          } else {
              const result = await profileInfo.insertOne({ displayName, email, photoURL });
              if (result.insertedCount > 0) {
                  // User details inserted successfully
                  res.status(200).json({ message: 'User details inserted successfully' });
              } else {
                  // Failed to insert user details
                  res.status(500).json({ error: 'Failed to insert user details' });
              }
          }
      } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/postProfileInfo', async (req, res) => {
      try {
        const { _id, ...updateData } = req.body;
        const result = await profileInfo.updateOne(
          { email: req.body.email },
          { $set: updateData }
        );
        if (result.modifiedCount > 0) {
          // The document was updated successfully
          res.status(200).json({ message: 'Profile info updated successfully' });
        } else {
          // No document was modified, possibly because the email didn't match any existing document
          res.status(404).json({ message: 'Profile not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
    

    app.post('/postAds', (req, res) => {
        // console.log(req.body);
        postAds.insertOne(req.body)
        .then(result => res.send(result))
      })
    
    app.post('/orderNow', async (req, res) => {
      const orderId= new ObjectId().toString();
      const objectId = new ObjectId(req.body._id);
      const product= await postAds.findOne({_id: objectId});
      const orderInfo= req.body
      // console.log(product);
      
      const data = {
        total_amount: product.price,
        currency: 'BDT',
        tran_id: orderInfo._id, // use unique tran_id for each api call
        success_url: `http://localhost:4000/payment/success/${orderId}/${orderInfo.userEmail}`,
        fail_url: `http://localhost:4000/payment/fail/${orderId}/${orderInfo.userEmail}`,
        // fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: orderInfo.itemName,
        product_category: orderInfo.category,
        product_profile: 'general',
        cus_name: orderInfo.userName,
        cus_email: orderInfo.userEmail,
        cus_add1: orderInfo.shippingAddress,
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: orderInfo.postCode,
        cus_country: 'Bangladesh',
        cus_phone: orderInfo.contactNumber,
        cus_fax: '01711111111',
        ship_name: orderInfo.userName,
        ship_add1: orderInfo.shippingAddress,
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: orderInfo.postCode,
        ship_country: 'Bangladesh',
      };
      // console.log(data);

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
      sslcz.init(data).then(apiResponse => {
          // Redirect the user to payment gateway
          let GatewayPageURL = apiResponse.GatewayPageURL
          res.send({url: GatewayPageURL})

          const finalOrder= {
            orderId: orderId,
            productId: orderInfo._id,
            customerInfo: orderInfo.userEmail,
            customerCredentials: data,
            paymentStatus: false,
          }
          const result= placedOrders.insertOne(finalOrder)
      });

      app.post('/payment/success/:orderId/:userId', async (req, res) => {
        try {
          const result = await placedOrders.updateOne(
            {
              orderId: req.params.orderId,
              customerInfo: req.params.userId,
            },
            { $set: { paymentStatus: true } }
          );
      
          if (result.modifiedCount > 0) {
            res.redirect('http://localhost:3000/paymentSuccess');
          } else {
            res.redirect('http://localhost:3000/paymentFailed');
          }
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });
      
      app.post('/payment/fail/:orderId/:userId', async (req, res) => {
        try {
          const result = await placedOrders.deleteOne(
            {
            orderId: req.params.orderId,
            customerInfo: req.params.userId,
            }
          );
      
          if (result.deletedCount > 0) {
            res.redirect('http://localhost:3000/paymentFailed');
          } else {
            res.redirect('http://localhost:3000/');
          }
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });
    })

    app.post('/deleteOrder', async (req, res) => {
      try {
        const { orderId } = req.body;
        const result = await placedOrders.deleteOne({ orderId });
    
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Data deleted successfully' });
        } else {
          res.status(404).json({ message: 'Data not found' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
