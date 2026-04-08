// get API by todays date

let currentIndex = 0;
let events = [];
let showAll = false;

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${yyyy}/${mm}/${dd}`;

const dateElement = document.getElementById("current-date");
dateElement.textContent = new Date().toLocaleDateString();

// fetch(url)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {

// // stop and remove loader
//     clearInterval(dotsInterval);
//     document.getElementById('loading').style.display = 'none';

//     events = data.onthisday;
//     showCard(currentIndex);
//   });

const fetchPromise = fetch(url).then(function (response) {
  return response.json();
});

const timerPromise = new Promise(function (resolve) {
  setTimeout(resolve, 5000); // 2 seconds minimum
});

Promise.all([fetchPromise, timerPromise]).then(function (results) {
  const data = results[0]; // fetch result is first

  clearInterval(dotsInterval);
  document.getElementById("loading").style.display = "none";

  events = data.onthisday;
  showCard(currentIndex);
});

function displayCards(onthisday) {
  const cardList = document.getElementById("card-list");
  cardList.innerHTML = "";
  onthisday.forEach(function (event) {
    addCard(event.year, event.text);
  });
}

function addCard(text, year) {
  const template = document
    .getElementById("card-template")
    .content.cloneNode(true);

  template.querySelector(".card-title").innerText = "In " + text + " ...";
  template.querySelector(".card-text").innerText = year;

  const card = template.querySelector(".card");
  card.style.cursor = "pointer";
  card.addEventListener("click", function () {
    localStorage.setItem(
      "selectedEvent",
      JSON.stringify({
        year: text,
        text: year,
      }),
    );
  });

  document.querySelector("#card-list").appendChild(template);
}

//counter and arrow functions for one card

function showCard(index) {
  const event = events[index];

  const cardList = document.getElementById("card-list");
  cardList.innerHTML = "";

  addCard(event.year, event.text);

  document.getElementById("counter").textContent =
    `${index + 1} / ${events.length}`;
  document.getElementById("prev").disabled = index === 0;
  document.getElementById("next").disabled = index === events.length - 1;
}

document.getElementById("prev").addEventListener("click", function () {
  currentIndex--;
  showCard(currentIndex);
});

document.getElementById("next").addEventListener("click", function () {
  currentIndex++;
  showCard(currentIndex);
});

//show all cards

document.getElementById("toggle-view").addEventListener("click", function () {
  showAll = !showAll;
  this.textContent = showAll ? "SHOW ONE" : "SHOW ALL";

  if (showAll) {
    displayCards(events);
    document.getElementById("controls").style.display = "none";
  } else {
    showCard(currentIndex);
    document.getElementById("controls").style.display = "flex";
  }
});

const dotsEl = document.getElementById("dots");
let dotCount = 0;
const dotsInterval = setInterval(function () {
  dotCount = (dotCount + 1) % 4;
  dotsEl.textContent = ".".repeat(dotCount);
}, 400);


const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})