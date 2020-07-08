const express = require('express');
const app = express();

const transactions = [
  { from: 'John Smith', to: 'Jane Smith', amount: 100 },
  { from: 'Jane Smith', to: 'John Smith', amount: 200 }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/api/transaction', (req, res) => {
  res.send(JSON.stringify(transactions));
});

app.post('/api/transaction', (req, res) => {
  const transaction = req.body;

  if ('from' in transaction && 'to' in transaction && 'amount' in transaction) {
    transactions.push(transaction);
    res.status(201).send(transaction);
  } else {
    res.status(400).send(JSON.stringify({ error: 'Invalid data' }));
  }
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});