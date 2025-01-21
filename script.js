const nameEl = document.querySelector(".name span");
const triesEl = document.querySelector(".tries span");
let triesCount = 0;
const cardsContainer = document.querySelector(".cards-container");
const playersContainer = document.querySelector(".players");
let players = JSON.parse(localStorage.getItem("Players")) || [];
const cardsArray = Array.from(
  document.querySelectorAll(".cards-container .card")
);
const duration = 1000;
const orderRange = shuffle([...Array(cardsArray.length).keys()]);
const helpButton = document.getElementById("help-button");

function startGame() {
  preventClicking();
  document.getElementById("start-game").play();
  cardsArray.forEach((card, index) => {
    card.style.order = orderRange[index];
    card.addEventListener("click", (e) => {
      flipCard(e.currentTarget);
    });
  });
  displayPlayers();
  flipAllCards();
  document.getElementById("clear-button").addEventListener("click", () => {
    players = [];
    localStorage.setItem("Players", JSON.stringify(players));
    window.location.reload();
  });
}

function displayPlayers() {
  playersContainer.innerHTML = "";
  playersContainer.style.visibility = "visible";
  playersContainer.style.opacity = 1;

  players.forEach((player) => {
    const div = document.createElement("div");
    div.innerHTML = `<span><strong>Player:</strong> ${player.name}</span> _ <span><strong>Tries:</strong> ${player.tries}</span>`;
    div.className = "player";
    playersContainer.prepend(div);
  });
}

function savePlayer(userName) {
  const currentPlayer = players.filter((player) => player.name === userName.toLowerCase());
  if (currentPlayer.length > 0) {
    currentPlayer[0].tries = triesCount;
  } else {
    const player = { name: userName.toLowerCase(), tries: triesCount };
    players.push(player);
  }
  localStorage.setItem("Players", JSON.stringify(players));
}

function shuffle(array) {
  let currentLen = array.length,
    temp,
    random;

  while (currentLen > 0) {
    random = Math.floor(Math.random() * currentLen);
    currentLen--;
    temp = array[currentLen];
    array[currentLen] = array[random];
    array[random] = temp;
  }

  return array;
}

function endGame() {
  const div = document.createElement("div");
  div.appendChild(
    triesCount == 12
      ? document.createTextNode("You Lost!")
      : document.createTextNode("You Won!")
  );
  div.style.cssText =
    "background-color: red; color: #fff; font-size: 10rem; text-align: center; transition: 1s; position: absolute; width: 100%; top: 10rem";
  cardsContainer.style.opacity = 0;
  cardsContainer.style.visibility = "hidden";
  helpButton.remove();
  document.querySelector(".content-container").append(div);
  if (triesCount == 12) {
    document.getElementById("lost").play();
  } else {
    document.getElementById("won").play();
  }
  setTimeout(() => {
    window.location.reload();
  }, 3000);
  players = JSON.parse(localStorage.getItem("Players"));
  savePlayer(nameEl.textContent);
  displayPlayers();
}

function flipCard(selectedCard) {
  selectedCard.classList.add("flipped");

  const flippedCards = cardsArray.filter((card) =>
    card.classList.contains("flipped")
  );
  if (flippedCards.length === 2) {
    preventClicking();
    checkMathedCards(flippedCards[0], flippedCards[1]);
  }
  if (triesCount == 7) {
    helpButton.style.visibility = "visible";
    helpButton.style.opacity = 1;
  } else {
    helpButton.addEventListener("click", () => {
      flipAllCards();
      helpButton.remove();
    });
  }
  if (
    cardsArray.every((card) => card.classList.contains("matched")) ||
    triesCount == 12
  ) {
    endGame();
  }
}

function preventClicking() {
  cardsContainer.style.pointerEvents = "none";

  setTimeout(() => {
    cardsContainer.style.pointerEvents = "all";
  }, duration);
}

function checkMathedCards(firstCard, secondCard) {
  if (firstCard.dataset.icon === secondCard.dataset.icon) {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    document.getElementById("successed").play();
  } else {
    triesCount += 1;
    triesEl.textContent = triesCount;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
    }, duration);
    document.getElementById("failed").play();
  }
}

function flipAllCards() {
  cardsArray.forEach((card) => {
    setTimeout(() => {
      card.classList.add("flipped");
    }, 200);
    setTimeout(() => {
      card.classList.remove("flipped");
    }, 1500);
  });
}

document.querySelector(".landing button").onclick = () => {
  const userName = prompt("What's your name?") || "Unknown";

  document.querySelector(".landing").remove();
  nameEl.textContent = userName;

  savePlayer(userName);
  startGame();
};
