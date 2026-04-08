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

const fetchPromise = fetch(url)
  .then(function(response) {
    return response.json();
  });

const timerPromise = new Promise(function(resolve) {
  setTimeout(resolve, 5000); // 2 seconds minimum
});

Promise.all([fetchPromise, timerPromise])
  .then(function(results) {
    const data = results[0]; // fetch result is first

    clearInterval(dotsInterval);
    document.getElementById('loading').style.display = 'none';

    events = data.onthisday;
    showCard(currentIndex);
  });

function displayCards(onthisday) {
  const cardList = document.getElementById("card-list");
  cardList.innerHTML = "";
  onthisday.forEach(function (event) {
    addCard(event.year, event.text, event.pages);
  });
}



function addCard(year, text, pages) {
  const template = document
    .getElementById("card-template")
    .content.cloneNode(true);

  const card = template.querySelector(".card");

  template.querySelector(".card-title").innerText = "On this day in " + year + " ...";
  template.querySelector(".card-text").innerText = text;

  card.setAttribute('data-year', year);
  card.setAttribute('data-text', text);

  const imgUrl = pages?.[0]?.originalimage?.source || '';
  const title = (pages?.[0]?.title || 'No title available').replaceAll('_', ' ');
  const extract = pages?.[0]?.extract || 'No information available';
  const wikiLink = pages?.[0]?.content_urls?.desktop?.page || '#';

   card.setAttribute('data-img', imgUrl);
   card.setAttribute('data-title', title);
   card.setAttribute('data-extract', extract);
   card.setAttribute('data-link', wikiLink);

  document.querySelector("#card-list").appendChild(template);
}



//counter and arrow functions for one card

function showCard(index) {
  const event = events[index];
  const cardList = document.getElementById('card-list');
  cardList.innerHTML = '';

  addCard(event.year, event.text, event.pages);

  document.getElementById('counter').textContent = `${index + 1} / ${events.length}`;
  document.getElementById('prev').disabled = index === 0;
  document.getElementById('next').disabled = index === events.length - 1;
}


document.getElementById('prev').addEventListener('click', function() {
  currentIndex--;
  showCard(currentIndex);
});

document.getElementById('next').addEventListener('click', function() {
  currentIndex++;
  showCard(currentIndex);
});

//show all cards

document.getElementById('toggle-view').addEventListener('click', function() {
  showAll = !showAll;
  this.textContent = showAll ? 'SHOW ONE' : 'SHOW ALL';

  if (showAll) {
    displayCards(events);
    document.getElementById('controls').style.display = 'none';
  } else {
    showCard(currentIndex);
    document.getElementById('controls').style.display = 'flex';
  }
});

const dotsEl = document.getElementById('dots');
let dotCount = 0;
const dotsInterval = setInterval(function() {
  dotCount = (dotCount + 1) % 4;
  dotsEl.textContent = '.'.repeat(dotCount);
}, 400);

// modal
const modal = document.getElementById('exampleModal');

modal.addEventListener('show.bs.modal', function(event) {

  const card = event.relatedTarget;

  document.getElementById('modal-title').textContent = card.getAttribute('data-title');
  document.getElementById('modal-extract').textContent = card.getAttribute('data-extract');
  document.getElementById('modal-link').href = card.getAttribute('data-link');

  const imgUrl = card.getAttribute('data-img');
  const modalImg = document.getElementById('modal-img');
  if (imgUrl) {
    modalImg.src = imgUrl;
    modalImg.style.display = 'block';
  } else {
    modalImg.style.display = 'none'; 
  }
});