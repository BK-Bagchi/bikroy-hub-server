require('dotenv').config()
const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


  app.get('/', (req, res) => {
    res.send('Welcome to Bikroy.com backend');
  })

  // app.get('/profileInfo', (req, res) => {
  // read data from here
  // })

  app.post('/profileInfo', (req, res) => {
  // write data from here
    const formData = req.body;
    res.json(formData);
    console.log(formData);
  })

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
