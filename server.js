const express = require('express');
const path = require('path');
const scrapeController = require('./controllers/scrapeController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/scrape', scrapeController.scrapeProducts);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Web interface: http://localhost:${PORT}`);
});