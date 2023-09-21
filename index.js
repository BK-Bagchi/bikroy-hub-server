const express = require('express');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.send('Welcome to Bikroy.com backend');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
