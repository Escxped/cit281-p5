const express = require('express');
const app = express();
const port = 4000;

const { startGame, hit, stand } = require('./p5-game');

app.use(express.json());
app.use(express.static('public'));

app.post('/start', (req, res) => {
  const { bet } = req.body;
  const result = startGame(bet);
  res.json(result);
});

app.get('/hit', (req, res) => {
  res.json(hit());
});

app.get('/stand', (req, res) => {
  res.json(stand());
});

app.listen(port, () => {
  console.log(`🃏 Blackjack server running at http://localhost:${port}`);
});
