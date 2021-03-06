const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const app = express();

let currentId = 2;
const transactions = [
  { id: 0, from: 'John Smith', to: 'Jane Smith', amount: 100 },
  { id: 1, from: 'Jane Smith', to: 'John Smith', amount: 200 }
];

const moviesLists = [

];

const goods = [
  {
    id: 0,
    title: 'Logitech C920 Hd Pro Webcam',
    description: `Full HD 1080p video that's faster, smoother and works on more computers.   Skype in Full HD 1080p Get breathtaking Full HD 1080p video calls on Skype for the sharpest video-calling experience.   Smoother. Sharper. Richer. Clearer. Logitech Fluid Crystal Technology. It's what makes a Logitech webcam better.`,
    price: 120
  },
  {
    id: 1,
    title: 'Logitech USB Headset H390 with Noise Cancelling Mic',
    description: `Padded headband and ear pads. Frequency response (Microphone): 100 hertz - 10 kilohertz
    Rotating, noise canceling microphone. Sensitivity (headphone) 94 dBV/Pa +/ 3 dB. Sensitivity (microphone) 17 dBV/Pa +/ 4 dB`,
    price: 50
  },
  {
    id: 2,
    title: 'Anker PowerCore 10000 Portable Charger',
    description: `One of The Smallest and Lightest 10000mAh Power Bank, Ultra-Compact Battery Pack, High-Speed Charging Technology Phone Charger for iPhone, Samsung and More.`,
    price: 150
  }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/api/test/', (req, res) => {
  res.send('OK');
});

app.get('/api/goods/', (req, res) => {
  res.status(200).send(JSON.stringify(goods));
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

  res.status(200).send(JSON.stringify(result));
});

app.post('/api/transaction/', (req, res) => {
  if ('from' in req.body && 'to' in req.body && 'amount' in req.body) {
    currentId++;
    let transaction = req.body;
    transaction = { ...transaction, id: currentId };
    transactions.push(transaction);

    if (transactions.length > 20) {
      transactions.shift();
    }

    console.log(transactions);
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

app.post('/api/movies/list/', (req, res) => {
  if ('title' in req.body && 'movies' in req.body) {
    const moviesList = {...req.body, id: uuid.v4()};
    moviesLists.push(moviesList);

    if (moviesLists.length > 100) {
      moviesLists.shift();
    }

    console.log(moviesLists);
    res.status(201).send(moviesList);
  } else {
    res.status(400).send(JSON.stringify({ error: 'Invalid data' }));
  }
});

app.get('/api/movies/list/:id', (req, res) => {
  const id = req.params.id;
  const match = moviesLists.find(item => item.id === id);

  if (match) {
    res.status(200).send(match);
  } else {
    res.status(404).send();
  }
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});
