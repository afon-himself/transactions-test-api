const express = require('express');
const https = require('https');
const cors = require('cors');
const uuid = require('uuid');
const CronJob = require('cron').CronJob;
const app = express();

function wakeUpHeroku(hostname, path) {
  const req = https.request({
    method: 'GET',
    port: 443,
    hostname,
    path
  }, (res) => {
    console.log(`[${res.statusCode}] – request to ${hostname + path}`);
  });
  
  req.end();
}

const job = new CronJob('43 * * * *', function() {
  wakeUpHeroku('healtheatapp.herokuapp.com', '/api/recipe');
  wakeUpHeroku('long-words-game.herokuapp.com', '/');
}, null, true);
job.start();

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
  },
  {
    id: 3,
    title: 'Apple Pencil (2nd Generation)',
    description: `Compatible with iPad Air (4th generation), iPad Pro 12.9-inch (3rd, 4th, and 5th generations), iPad Pro 11-inch (1st, 2nd, and 3rd generations)`,
    price: 40
  },
  {
    id: 4,
    title: 'SAMSUNG: EVO Select 128GB MicroSD',
    description: `IDEAL FOR RECORDING 4K UHD VIDEO: Samsung microSD EVO Select is perfect for high res photos, gaming, music, tablets, laptops, action cameras, DSLR's, drones, smartphones (Galaxy S20 5G, S20 5G, S20 Ultra 5G, S10, S10 , S10e, S9, S9 , Note9, S8, S8 , Note8, S7, S7 Edge, etc. ), Android devices and more.`,
    price: 20
  },
  {
    id: 5,
    title: 'ZOTAC Gaming GeForce RTX 3060',
    description: `NVIDIA Ampere architecture, 2nd Gen Ray Tracing Cores, 3rd Gen Tensor Cores. 12GB 192-bit GDDR6, 15 Gbps, PCIE 4.0; Boost Clock 1807 MHz. IceStorm 2.0 Cooling, Active Fan Control, Freeze Fan Stop, Metal Backplate.`,
    price: 650
  },
  {
    id: 6,
    title: 'Roku Express 4K+ 2021 | Streaming Media Player',
    description: `Smooth wireless streaming: Now featuring dual-band wireless, enjoy a smooth streaming experience with faster wireless performance, even with multiple devices connected to your network`,
    price: 28
  }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors());

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/api/test/', (req, res) => {
  res.send('OK');
});

app.get('/api/goods/', (req, res) => {
  const { page, limit } = req.query;

  if (!page || !limit) {
    res.status(200).send(goods);
  } else {
    const from = page * limit;
    const to = Number(from) + Number(limit);

    res.status(200).send(goods.slice(from, to));
  }

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
