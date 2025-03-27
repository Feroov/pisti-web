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

restartBtn.addEventListener('click', () => {
    // Hide game over screen
    gameOverScreen.classList.add('hidden');

    // Show splash screen
    document.getElementById('splash-screen').classList.remove('hidden');

    // Hide all game parts so it looks clean
    document.getElementById('ai-hand').classList.add('hidden');
    document.getElementById('player-hand').classList.add('hidden');
    document.getElementById('table-area').classList.add('hidden');
    document.getElementById('player-score').classList.add('hidden');
    document.getElementById('ai-score').classList.add('hidden');

    // Reset score display
    playerScoreDisplay.textContent = '0';
    aiScoreDisplay.textContent = '0';
    potCountDisplay.textContent = '0';

    // Clear messages and visuals
    playerMessage.textContent = '';
    aiMessage.textContent = '';
    playerWonCardsDiv.innerHTML = '';
    aiWonCardsDiv.innerHTML = '';
    tablePileDiv.innerHTML = '';
    document.getElementById('player-pisti-cards').innerHTML = '';
    document.getElementById('ai-pisti-cards').innerHTML = '';
});
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
    roundCountDisplay.textContent = Math.min(currentRound, totalRounds);
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
                showMessage(playerMessage, 'Pisti! +10 points', '⭐', true);
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
                showMessage(playerMessage, isJack ? 'Jack wins all!' : 'Cards captured!', '✋', false);
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
    });

    playerHandDiv.removeChild(cardElement);
}

// Helper function to show messages with animation
function showMessage(element, text, icon = '', highlight = false) {
    element.innerHTML = icon ? `${icon} ${text}` : text;
    element.classList.add('active');
    if (highlight) {
        element.classList.add('highlight');
    }
    setTimeout(() => {
        element.classList.remove('active', 'highlight');
        element.innerHTML = '';
    }, 2000);
}

// AI's turn
function aiTurn() {
    console.log(`[aiTurn] Start: aiHand.length=${aiHand.length}, playerHand.length=${playerHand.length}, deck.length=${deck.length}, tablePile.length=${tablePile.length}`);

    if (aiHand.length === 0) {
        console.log("[aiTurn] AI has no cards, calling checkDealMoreCards");
        checkDealMoreCards();
        return; // Let checkDealMoreCards handle the end
    }

    const card = aiHand[0];
    const cardElement = aiHandDiv.querySelector(`[data-index="0"]`);

    if (tablePile.length === 0) {
        const nonJackIndex = aiHand.findIndex(c => !c.startsWith("jack_of_"));
        if (nonJackIndex > -1) {
            const [nonJackCard] = aiHand.splice(nonJackIndex, 1);
            aiHand.unshift(nonJackCard);
        }
    }

    aiHand.shift();
    console.log(`[aiTurn] After shift: aiHand.length=${aiHand.length}, playerHand.length=${playerHand.length}, deck.length=${deck.length}`);

    // Check if this is the last card of the game
    const isLastCardOfGame = deck.length === 0 && playerHand.length === 0 && aiHand.length === 0;

    animatePlay(cardElement, 'ai-play-to-table', true, () => {
        const topCard = tablePile.length > 0 ? tablePile[tablePile.length - 1] : null;
        const getRank = (cardStr) => cardStr.split('_of_')[0];
        const isJack = getRank(card) === 'jack';

        tablePile.push(card);
        updateDisplay();
        console.log(`[aiTurn] After play: aiHand.length=${aiHand.length}, playerHand.length=${playerHand.length}, deck.length=${deck.length}, tablePile.length=${tablePile.length}`);

        if (isJack || (topCard && getRank(topCard) === getRank(card))) {
            if (tablePile.length === 2 && !isJack) {
                aiScore += 10;
                showMessage(aiMessage, 'AI Pisti! +10 points', '⭐', true);
                isPisti = true;
                aiPistiCount++;
                updatePistiCards('ai-pisti-cards', aiPistiCount, card);
                setTimeout(() => {
                    animateCapture('capture-to-ai', () => {
                        aiWonCards += tablePile.length;
                        tablePile = [];
                        isPisti = false;
                        updateDisplay();
                        console.log(`[aiTurn] After Pisti capture: aiHand.length=${aiHand.length}, playerHand.length=${playerHand.length}, deck.length=${deck.length}`);
                        if (isLastCardOfGame) {
                            console.log("[aiTurn] Last card captured (Pisti), ending game");
                            checkGameEnd();
                        } else {
                            checkDealMoreCards();
                            playerCanPlay = true;
                            updateTurnIndicator(true);
                        }
                    });
                }, 1000);
            } else {
                aiScore += tablePile.length;
                aiWonCards += tablePile.length;
                isPisti = false;
                showMessage(aiMessage, isJack ? 'AI Jack wins all!' : 'Cards captured!', '✋', false);
                animateCapture('capture-to-ai', () => {
                    tablePile = [];
                    updateDisplay();
                    console.log(`[aiTurn] After capture: aiHand.length=${aiHand.length}, playerHand.length=${playerHand.length}, deck.length=${deck.length}`);
                    if (isLastCardOfGame) {
                        console.log("[aiTurn] Last card captured, ending game");
                        checkGameEnd();
                    } else {
                        checkDealMoreCards();
                        playerCanPlay = true;
                        updateTurnIndicator(true);
                    }
                });
            }
        } else {
            isPisti = false;
            updateDisplay();
            if (isLastCardOfGame) {
                console.log("[aiTurn] Last card played (no capture), ending game");
                checkGameEnd();
            } else {
                checkDealMoreCards();
                playerCanPlay = true;
                updateTurnIndicator(true);
            }
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

// Check if more cards need to be dealt or if the round/game ends
function checkDealMoreCards() {
    console.log(`[checkDealMoreCards] Start: playerHand.length=${playerHand.length}, aiHand.length=${aiHand.length}, deck.length=${deck.length}, tablePile.length=${tablePile.length}, currentRound=${currentRound}, totalRounds=${totalRounds}`);
    
    if (playerHand.length === 0 && aiHand.length === 0) {
        if (deck.length > 0 && currentRound < totalRounds) {
            console.log("[checkDealMoreCards] Dealing more cards");
            currentRound++;
            dealMoreCards();
        } else {
            console.log("[checkDealMoreCards] No more cards to deal, calling checkGameEnd");
            checkGameEnd();
        }
    }
}

// Check if game is over
function checkGameEnd() {
    console.log(`[checkGameEnd] Checking: deck.length=${deck.length}, playerHand.length=${playerHand.length}, aiHand.length=${aiHand.length}, tablePile.length=${tablePile.length}`);
    
    if ((deck.length === 0 || currentRound >= totalRounds) && playerHand.length === 0 && aiHand.length === 0) {
        // Award remaining table cards to the last capturer
        if (tablePile.length > 0) {
            if (currentRound >= totalRounds) {
                // Last round and no cards in hand — discard remaining pile
                console.log("[checkGameEnd] Last round over, discarding remaining table cards.");
            } else if (playerCanPlay) {
                console.log("[checkGameEnd] Awarding remaining table cards to AI (last capturer)");
                aiWonCards += tablePile.length;
                aiScore += tablePile.length;
            } else {
                console.log("[checkGameEnd] Awarding remaining table cards to Player (last capturer)");
                playerWonCards += tablePile.length;
                playerScore += tablePile.length;
            }
            tablePile = [];
            updateDisplay();
        }
        

        console.log("[checkGameEnd] Game over condition met, showing winner screen");
        gameOverScreen.classList.remove('hidden');
        document.getElementById('ai-hand').classList.add('hidden');
        document.getElementById('player-hand').classList.add('hidden');
        document.getElementById('table-area').classList.add('hidden');
        document.getElementById('player-score').classList.add('hidden');
        document.getElementBy
        

        const winner = playerScore > aiScore ? 'Player' : (aiScore > playerScore ? 'AI' : 'Tie');
        gameOverTitle.textContent = winner === 'Tie' ? 'Game Over - Tie!' : `${winner} Wins!`;
        gameOverMessage.textContent = `Player: ${playerScore} | AI: ${aiScore}\nPlayer Pisti: ${playerPistiCount} | AI Pisti: ${aiPistiCount}`;
        
        // Disable further play
        playerCanPlay = false;
        updateTurnIndicator(false); // Turn off both indicators
    } else {
        console.log("[checkGameEnd] Game not over yet");
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

    // Restore all hidden sections
    document.getElementById('ai-hand').classList.remove('hidden');
    document.getElementById('player-hand').classList.remove('hidden');
    document.getElementById('table-area').classList.remove('hidden');
    document.getElementById('player-score').classList.remove('hidden');
    document.getElementById('ai-score').classList.remove('hidden');

    gameOverScreen.classList.add('hidden');
    const splashScreen = document.getElementById('splash-screen');
    splashScreen.classList.add('hidden');
    gameContainer.style.display = 'flex';
}


// Update turn indicator
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

// Update pisti cards display
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