const { Deck } = require('./p5-class');

let deck, playerHand, dealerHand;
let bank = 10000;
let betAmount = 20;

function startGame(amount) {
  if (amount > bank || amount <= 0) {
    return { error: 'Invalid bet amount', bank };
  }

  betAmount = amount;
  bank -= betAmount;

  deck = new Deck();
  deck.shuffle();

  playerHand = [deck.draw(), deck.draw()];
  dealerHand = [deck.draw(), deck.draw()];

  return getStatus();
}

function handValue(hand) {
  let value = hand.reduce((sum, card) => sum + card.value, 0);
  let aces = hand.filter(card => card.rank === 'A');
  while (value > 21 && aces.length > 0) {
    value -= 10;
    aces.pop();
  }
  return value;
}

function getStatus() {
  return {
    player: {
      hand: playerHand,
      value: handValue(playerHand)
    },
    dealer: {
      hand: [dealerHand[0], { rank: '??', suit: '', value: 0 }],
      value: '?'
    },
    bank
  };
}

function hit() {
  playerHand.push(deck.draw());
  return checkGameEnd();
}

function stand() {
  while (handValue(dealerHand) < 17) {
    dealerHand.push(deck.draw());
  }
  return finalResult();
}

function checkGameEnd() {
  const value = handValue(playerHand);
  if (value > 21) {
    return finalResult(true);
  }
  return getStatus();
}

function finalResult(forceBust = false) {
  const playerValue = handValue(playerHand);
  const dealerValue = handValue(dealerHand);
  let result;

  if (forceBust || playerValue > 21) {
    result = 'Player Busts! Dealer Wins!';
  } else if (dealerValue > 21 || playerValue > dealerValue) {
    result = 'Player Wins!';
    bank += betAmount * 2;
  } else if (playerValue < dealerValue) {
    result = 'Dealer Wins!';
  } else {
    result = 'Push (Tie)!';
    bank += betAmount;
  }

  return {
    player: { hand: playerHand, value: playerValue },
    dealer: { hand: dealerHand, value: dealerValue },
    result,
    bank
  };
}

module.exports = { startGame, hit, stand };
