const express = require('express');
const app = express();

let currentId = 2;
const transactions = [
  { id: 0, from: 'John Smith', to: 'Jane Smith', amount: 100 },
  { id: 1, from: 'Jane Smith', to: 'John Smith', amount: 200 }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Transactions Test API');
  // res.render('index.html');
});

app.get('/api/transaction/', (req, res) => {
  const { from, to } = req.query;
  console.log(req.query)

  let result = [...transactions];

  if (from) {
    result = result.filter(item => item.from === from);
  }

  if (to) {
    result = result.filter(item => item.to === to);
  }

  res.send(JSON.stringify(result));
});

app.post('/api/transaction/', (req, res) => {
  if ('from' in req.body && 'to' in req.body && 'amount' in req.body) {
    currentId++;
    let transaction = req.body;
    transaction = { ...transaction, id: currentId };
    transactions.push(transaction);
    res.status(201).send(transaction);
  } else {
    res.status(400).send(JSON.stringify({ error: 'Invalid data' }));
  }
});

app.put('/api/transaction/:id/', (req, res) => {
  const id = req.params.id;
  let data = req.body;
  const transaction = transactions.find(item => item.id === Number(id));

  if (transaction) {
    if ('from' in data && 'to' in data && 'amount' in data) {
      transaction.from = data.from;
      transaction.to = data.to;
      transaction.amount = data.amount;

      res.status(200).send(JSON.stringify(transaction));
    } else {
      res.status(400).send(JSON.stringify({ error: 'Invalid data' }));
    }
  } else {
    res.status(404).send(JSON.stringify({ error: 'Transaction not found' }));
  }
});

app.delete('/api/transaction/:id/', (req, res) => {
  const id = req.params.id;
  const index = transactions.findIndex(item => item.id === Number(id));

  if (index > -1) {
    transactions.splice(index, 1);
    res.status(200).send(JSON.stringify(transactions));
  } else {
    res.status(404).send(JSON.stringify({ error: 'Transaction not found' }));
  }
  
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});
