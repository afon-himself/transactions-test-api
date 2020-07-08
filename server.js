const express = require('express');
const app = express();

const transactions = [
  { from: 'John Smith', to: 'Jane Smith', amount: 100 },
  { from: 'Jane Smith', to: 'John Smith', amount: 200 }
];

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/api/transaction', (req, res) => {
  res.send(JSON.stringify(transactions));
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});