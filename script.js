// Deck setup
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
let deck = [];
let playerHand = [];
let aiHand = [];
let tablePile = [];
let playerScore = 0;
let aiScore = 0;
let playerWonCards = 0;
let aiWonCards = 0;
let playerPistiCount = 0;
let aiPistiCount = 0;
let isPisti = false;
let playerCanPlay = true;
let originalDeckCount = 0;
let currentRound = 1;
let totalRounds = 6;


const playerHandDiv = document.getElementById('player-hand');
const aiHandDiv = document.getElementById('ai-hand');
const tablePileDiv = document.getElementById('table-pile');
const potCountDisplay = document.getElementById('pot-count');
const playerScoreDisplay = document.getElementById('player-score-value');
const aiScoreDisplay = document.getElementById('ai-score-value');
const playerMessage = document.getElementById('player-message');
const aiMessage = document.getElementById('ai-message');
const playerWonCardsDiv = document.getElementById('player-won-cards');
const aiWonCardsDiv = document.getElementById('ai-won-cards');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');

const gameOverScreen = document.getElementById('game-over');
const gameOverTitle = document.getElementById('game-over-title');
const gameOverMessage = document.getElementById('game-over-message');
const restartBtn = document.getElementById('restart-btn');

restartBtn.addEventListener('click', () => startGame(6));
startBtn.addEventListener('click', () => startGame(6));

// Create a fresh deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            if (rank !== '2') {
                deck.push(`${rank}_of_${suit}`);
            }
        }
    }
    shuffle(deck);
    originalDeckCount = deck.length;
}

// Shuffle array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Deal cards with animation
function dealCards() {
    playerHand = deck.splice(0, 4);
    aiHand = deck.splice(0, 4);
    tablePile = deck.splice(0, 1);
    isPisti = false;
    animateDeal();
}

// Animate dealing
function animateDeal() {
    const containerRect = gameContainer.getBoundingClientRect();
    const startX = -70;
    const startY = containerRect.height / 2 - 52.5;

    gameContainer.style.overflow = 'visible';

    const deckEl = document.createElement('div');
    deckEl.className = 'card';
    deckEl.style.backgroundImage = `url('images/cards/back.png')`;
    deckEl.style.position = 'absolute';
    deckEl.style.left = `${startX}px`;
    deckEl.style.top = `${startY}px`;
    deckEl.style.zIndex = '3000';
    gameContainer.appendChild(deckEl);

    playerHandDiv.innerHTML = '';
    aiHandDiv.innerHTML = '';

    playerHand.forEach((card, i) => {
        const clone = document.createElement('div');
        clone.className = 'card';
        clone.style.backgroundImage = `url('images/cards/${card}.png')`;
        clone.style.position = 'absolute';
        clone.style.left = `${startX}px`;
        clone.style.top = `${startY}px`;
        clone.style.opacity = '0';
        clone.style.transform = 'rotateY(90deg)';
        clone.style.zIndex = '2000';
        gameContainer.appendChild(clone);

        const tempCard = document.createElement('div');
        tempCard.className = 'card';
        playerHandDiv.appendChild(tempCard);
        const finalRect = tempCard.getBoundingClientRect();
        const finalX = finalRect.left - containerRect.left;
        const finalY = finalRect.top - containerRect.left;
        playerHandDiv.removeChild(tempCard);

        setTimeout(() => {
            clone.style.transition = 'all 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)';
            clone.style.left = `${finalX}px`;
            clone.style.top = `${finalY}px`;
            clone.style.opacity = '1';
            clone.style.transform = 'rotateY(0deg)';
        }, i * 150);

        setTimeout(() => {
            const realCard = document.createElement('div');
            realCard.className = 'card';
            realCard.style.backgroundImage = `url('images/cards/${card}.png')`;
            realCard.addEventListener('click', () => playCard(card));
            playerHandDiv.appendChild(realCard);
            clone.remove();
        }, 700 + i * 150);
    });

    setTimeout(() => {
        aiHand.forEach((_, i) => {
            const clone = document.createElement('div');
            clone.className = 'card';
            clone.style.backgroundImage = `url('images/cards/back.png')`;
            clone.style.position = 'absolute';
            clone.style.left = `${startX}px`;
            clone.style.top = `${startY}px`;
            clone.style.opacity = '0';
            clone.style.transform = 'rotateY(90deg)';
            clone.style.zIndex = '2000';
            gameContainer.appendChild(clone);

            const tempCard = document.createElement('div');
            tempCard.className = 'card';
            aiHandDiv.appendChild(tempCard);
            const finalRect = tempCard.getBoundingClientRect();
            const finalX = finalRect.left - containerRect.left;
            const finalY = finalRect.top - containerRect.left;
            aiHandDiv.removeChild(tempCard);

            setTimeout(() => {
                clone.style.transition = 'all 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)';
                clone.style.left = `${finalX}px`;
                clone.style.top = `${finalY}px`;
                clone.style.opacity = '1';
                clone.style.transform = 'rotateY(0deg)';
            }, i * 150);

            setTimeout(() => {
                const realCard = document.createElement('div');
                realCard.className = 'card';
                realCard.style.backgroundImage = `url('images/cards/back.png')`;
                realCard.dataset.index = i;
                aiHandDiv.appendChild(realCard);
                clone.remove();
                if (i === aiHand.length - 1) {
                    deckEl.remove();
                    gameContainer.style.overflow = 'hidden';
                    updateDisplay();
                }
            }, 700 + i * 150);
        });
    }, playerHand.length * 150 + 700);
}


// Update game display
function updateDisplay() {
    const roundCountDisplay = document.getElementById('round-count');
    const totalRoundsDisplay = document.getElementById('total-rounds');
    roundCountDisplay.textContent = currentRound;
    totalRoundsDisplay.textContent = totalRounds;

    tablePileDiv.innerHTML = '';
    if (tablePile.length > 0) {
        if (isPisti) {
            const pistiCard = document.createElement('div');
            pistiCard.className = 'pisti-card';
            const backCard = document.createElement('div');
            backCard.className = 'pisti-back';
            const halfCard = document.createElement('div');
            halfCard.className = 'pisti-half';
            halfCard.style.backgroundImage = `url('images/cards/${tablePile[tablePile.length - 1]}.png')`;
            pistiCard.appendChild(backCard);
            pistiCard.appendChild(halfCard);
            tablePileDiv.appendChild(pistiCard);
        } else {
            tablePile.forEach((card, index) => {
                const cardEl = document.createElement('div');
                cardEl.className = 'stacked-card';
                cardEl.style.backgroundImage = `url('images/cards/${card}.png')`;
                const offsetX = Math.random() * 20 - 10;
                const offsetY = Math.random() * 20 - 10;
                const rotation = Math.random() * 20 - 10;
                cardEl.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
                cardEl.style.zIndex = index;
                tablePileDiv.appendChild(cardEl);
            });
        }
    }

    potCountDisplay.textContent = tablePile.length;

    playerScoreDisplay.textContent = playerScore;
    aiScoreDisplay.textContent = aiScore;

    playerHandDiv.innerHTML = '';
    playerHand.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.style.backgroundImage = `url('images/cards/${card}.png')`;
        cardEl.addEventListener('click', () => playCard(card));
        playerHandDiv.appendChild(cardEl);
    });

    aiHandDiv.innerHTML = '';
    aiHand.forEach((_, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.style.backgroundImage = `url('images/cards/back.png')`;
        cardEl.dataset.index = index;
        aiHandDiv.appendChild(cardEl);
    });

    updateWonCards(playerWonCardsDiv, playerWonCards);
    updateWonCards(aiWonCardsDiv, aiWonCards);
}



// Update won cards pile
function updateWonCards(container, count) {
    container.innerHTML = '';
    const maxVisibleCards = 5;
    const cardsToShow = Math.min(count, maxVisibleCards);
    for (let i = 0; i < cardsToShow; i++) {
        const cardEl = document.createElement('div');
        cardEl.className = 'won-card';
        const offsetX = Math.random() * 10 - 5;
        const offsetY = Math.random() * 10 - 5;
        const rotation = Math.random() * 10 - 5;
        cardEl.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
        cardEl.style.zIndex = i;
        container.appendChild(cardEl);
    }
}

// Player plays a card
function playCard(card) {
    if (!playerCanPlay) return;

    playerCanPlay = false;
    updateTurnIndicator(false);
    const index = playerHand.indexOf(card);
    const cardElement = playerHandDiv.children[index];

    animatePlay(cardElement, 'play-to-table', false, () => {
        const topCard = tablePile.length > 0 ? tablePile[tablePile.length - 1] : null;
        const getRank = (cardStr) => cardStr.split('_of_')[0];
        const isJack = getRank(card) === 'jack';

        tablePile.push(card);
        playerHand.splice(index, 1);
        updateDisplay();

        if (isJack || (topCard && getRank(topCard) === getRank(card))) {
            if (tablePile.length === 2 && !isJack) {
                playerScore += 10;
                playerMessage.textContent = 'Pisti! +10 points';
                setTimeout(() => { playerMessage.textContent = ''; }, 2000);
                isPisti = true;
                playerPistiCount++;
                updatePistiCards('player-pisti-cards', playerPistiCount, card);
                setTimeout(() => {
                    animateCapture('capture-to-player', () => {
                        playerWonCards += tablePile.length;
                        tablePile = [];
                        isPisti = false;
                        updateDisplay();
                        checkDealMoreCards();
                        setTimeout(() => {
                            aiTurn();
                        }, 800);
                    });
                }, 1000);
            } else {
                playerScore += tablePile.length;
                playerWonCards += tablePile.length;
                isPisti = false;
                playerMessage.textContent = isJack ? 'Jack wins all!' : '';
                setTimeout(() => { playerMessage.textContent = ''; }, 2000);
                animateCapture('capture-to-player', () => {
                    tablePile = [];
                    updateDisplay();
                    checkDealMoreCards();
                    setTimeout(() => {
                        aiTurn();
                    }, 800);
                });
            }
        } else {
            checkDealMoreCards();
            setTimeout(() => {
                aiTurn();
            }, 800);
        }

        checkGameEnd();
    });

    playerHandDiv.removeChild(cardElement);
}



// AI's turn
function aiTurn() {
    const card = aiHand[0];
    const cardElement = aiHandDiv.querySelector(`[data-index="0"]`);
    if (aiHand.length === 0) {
        checkDealMoreCards();
        checkGameEnd();
        return;
    }

    if (tablePile.length === 0) {
        const nonJackIndex = aiHand.findIndex(c => !c.startsWith("jack_of_"));
        if (nonJackIndex > -1) {
            const [nonJackCard] = aiHand.splice(nonJackIndex, 1);
            aiHand.unshift(nonJackCard);
        }
    }

    aiHand.shift();

    animatePlay(cardElement, 'ai-play-to-table', true, () => {
        const topCard = tablePile.length > 0 ? tablePile[tablePile.length - 1] : null;
        tablePile.push(card);
        const getRank = (cardStr) => cardStr.split('_of_')[0];
        const isJack = getRank(card) === 'jack';

        if (isJack || (topCard && getRank(topCard) === getRank(card))) {
            if (tablePile.length === 2 && !isJack) {
                aiScore += 10;
                aiMessage.textContent = 'AI Pisti! +10 points';
                setTimeout(() => { aiMessage.textContent = ''; }, 2000);
                isPisti = true;
                aiPistiCount++;
                updatePistiCards('ai-pisti-cards', aiPistiCount, card);
                updateDisplay();
                setTimeout(() => {
                    animateCapture('capture-to-ai', () => {
                        aiScore += tablePile.length;
                        aiWonCards += tablePile.length;
                        tablePile = [];
                        isPisti = false;
                        updateDisplay();
                        checkDealMoreCards();
                        checkGameEnd();
                        playerCanPlay = true;
                        updateTurnIndicator(true);
                    });
                }, 1000);
            } else {
                aiScore += tablePile.length;
                aiWonCards += tablePile.length;
                isPisti = false;
                aiMessage.textContent = isJack ? 'AI Jack wins all!' : '';
                setTimeout(() => { aiMessage.textContent = ''; }, 2000);
                animateCapture('capture-to-ai', () => {
                    tablePile = [];
                    updateDisplay();
                    checkDealMoreCards();
                    checkGameEnd();
                    playerCanPlay = true;
                    updateTurnIndicator(true);
                });
            }
        } else {
            isPisti = false;
            updateDisplay();
            checkDealMoreCards();
            checkGameEnd();
            playerCanPlay = true;
            updateTurnIndicator(true);
        }
    }, card);

    if (cardElement) aiHandDiv.removeChild(cardElement);
}



// Animate card play
function animatePlay(cardElement, animationClass, isAI, callback, cardName = null) {
    const rect = cardElement.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    const startX = rect.left - containerRect.left;
    const startY = rect.top - containerRect.top;

    const clone = document.createElement('div');
    clone.className = `animated-card ${animationClass}`;
    if (isAI) {
        clone.style.backgroundImage = `url('images/cards/back.png')`;

        setTimeout(() => {
            clone.style.backgroundImage = `url('images/cards/${cardName}.png')`;
        }, 250);
    } else {
        clone.style.backgroundImage = cardElement.style.backgroundImage;
    }

    clone.style.left = `${startX}px`;
    clone.style.top = `${startY}px`;
    gameContainer.appendChild(clone);

    setTimeout(() => {
        clone.remove();
        callback();
    }, 500);
}

// Animate capture
function animateCapture(animationClass, callback) {
    const pileCards = tablePileDiv.children;
    Array.from(pileCards).forEach(card => {
        card.classList.add(animationClass);
    });
    setTimeout(callback, 500);
}

// Deal more cards
function dealMoreCards() {
    const cardsToDeal = Math.min(4, Math.floor(deck.length / 2));
    playerHand = deck.splice(0, cardsToDeal);
    aiHand = deck.splice(0, cardsToDeal);
    updateDisplay();
    animateDeal();
}

// Check if game is over
function checkGameEnd() {
    if ((deck.length === 0 && playerHand.length === 0 && aiHand.length === 0) ||
        (currentRound >= totalRounds && deck.length === 0)) {
        playerScore = 0;
        aiScore = 0;
        playerWonCards = 0;
        aiWonCards = 0;
        playerPistiCount = 0;
        aiPistiCount = 0;
        currentRound = 1;
        playerHand = [];
        aiHand = [];
        tablePile = [];
        deck = [];
        playerCanPlay = true;

        gameContainer.style.display = 'none';
        document.getElementById('splash-screen').classList.remove('hidden');
        gameOverScreen.classList.add('hidden');
    }
}

// Start the game
function startGame(rounds = 6) {
    playerScore = 0;
    aiScore = 0;
    playerWonCards = 0;
    aiWonCards = 0;
    playerPistiCount = 0;
    aiPistiCount = 0;
    currentRound = 1;
    totalRounds = rounds;
    createDeck();
    originalDeckCount = deck.length;
    dealCards();
    playerMessage.textContent = '';
    aiMessage.textContent = '';
    updateTurnIndicator(true);

    gameOverScreen.classList.add('hidden');
    const splashScreen = document.getElementById('splash-screen');
    splashScreen.classList.add('hidden');
    gameContainer.style.display = 'flex';
}


function updateTurnIndicator(isPlayerTurn) {
    const playerIndicator = document.getElementById('player-turn-indicator');
    const aiIndicator = document.getElementById('ai-turn-indicator');

    if (isPlayerTurn) {
        playerIndicator.classList.add('active');
        aiIndicator.classList.remove('active');
    } else {
        aiIndicator.classList.add('active');
        playerIndicator.classList.remove('active');
    }
}

function updatePistiCards(containerId, count, lastCard) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const cardEl = document.createElement('div');
        cardEl.className = 'pisti-won-card';

        cardEl.style.backgroundImage = (i === count - 1 && lastCard)
            ? `url('images/cards/${lastCard}.png')`
            : `url('images/cards/back.png')`;

        const offsetX = i * 5;
        const offsetY = 0;
        const rotation = i * 2;
        cardEl.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
        cardEl.style.zIndex = i;
        container.appendChild(cardEl);
    }
}

function checkDealMoreCards() {
    if (playerHand.length === 0 && aiHand.length === 0) {
        if (deck.length > 0) {
            currentRound++;
            dealMoreCards();
        } else {
            checkGameEnd();
        }
    }
}