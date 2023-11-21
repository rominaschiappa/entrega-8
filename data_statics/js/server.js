const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000; 

app.use(express.static(path.join(__dirname, 'data')));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


app.get('/cat.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'cat.json'));
});

app.get('/publish.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'publish.json'));
});

app.get('/cats_products/archivo1.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'archivo1.json'));
});

app.get('/cats_products/archivo2.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'archivo2.json'));
});

app.get('/products/:productId.json', (req, res) => {
  const productId = req.params.productId;
  res.sendFile(path.join(__dirname, 'data', 'products', `${productId}.json`));
});

app.get('/products_comments/:productId.json', (req, res) => {
  const productId = req.params.productId;
  res.sendFile(path.join(__dirname, 'data', 'products_comments', `${productId}.json`));
});

app.get('/user_cart/:cartId.json', (req, res) => {
  const cartId = req.params.cartId;
  res.sendFile(path.join(__dirname, 'data', 'user_cart', `${cartId}.json`));
});

app.get('/cart/buy.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'cart', 'buy.json'));
});


