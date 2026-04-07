const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${yyyy}/${mm}/${dd}`;

fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    displayCards(data.onthisday);
  });

  const dateElement = document.getElementById('current-date');
dateElement.textContent = new Date().toLocaleDateString();
    
    // document.getElementById('category-dropdown').addEventListener('click', function(e) {
    //   if (e.target.classList.contains('dropdown-item')) {
    //     const selected = e.target.dataset.category;
    //     const filtered = selected === 'all'
    //       ? products
    //       : products.filter(function(p) {
    //           return p.category === selected;
    //         });

    //     document.getElementById('card-list').innerHTML = '';
    //     displayCards(filtered);
    //   }
    // });

function displayCards(onthisday) {
  onthisday.forEach(function(event) {
    addCard(event.year, event.text);
  });
}

function addCard(text, year) {
  const template = document
    .getElementById("card-template")
    .content.cloneNode(true);

  template.querySelector(".card-title").innerText = year;
  template.querySelector(".card-text").innerText = text;


  document.querySelector("#card-list").appendChild(template);
}