




/*Gestion des images et filtres*/

function loadCategories() {
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
      displayFilterButtons(data);
    })
    .catch(error => console.error('Erreur lors du chargement des catégories:', error));
}

function displayFilterButtons(categories) {
  const filterButtonsDiv = document.getElementById('filter-buttons');
  filterButtonsDiv.innerHTML = '';

  filterButtonsDiv.innerHTML += `<button class="filter-btns" onclick="filterItems('all')">Tous</button>`;

  categories.forEach(category => {
    filterButtonsDiv.innerHTML += `<button class="filter-btns" onclick="filterItems(${category.id})">${category.name}</button>`;
  });
}

function loadItems() {
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
      displayItems(data);
    })
    .catch(error => console.error('Erreur lors du chargement des éléments:', error));
}

function displayItems(items) {
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = '';

  items.forEach(item => {
    itemList.innerHTML += `
      <div class="item" data-category="${item.category.name}">
        <img src="${item.imageUrl}" alt="${item.title}">
        <h3>${item.title}</h3>
      </div>`;
  });
}

function filterItems(categoryId) {
  if (categoryId === 'all') {
    loadItems();
  } else {
    fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(data => {
        const filteredItems = data.filter(item => item.category.id === categoryId);
        displayItems(filteredItems);
      })
      .catch(error => console.error('Erreur lors du filtrage des éléments:', error));
  }
}





  loadCategories();
  loadItems();


function adminMode() {
    /**Check if a token is present in the sessionStorage */
    if (sessionStorage.getItem("token")) {
        const header = document.querySelector('header');
        const switchLogout = document.getElementById('logout');
        const portfolio = document.getElementById('portfolio');
        const titlemyProjets = document.createElement('h2');
        titlemyProjets.textContent = "Mes Projets";

        /**Create <div> edit mode content and insert at the beginning of the header */
        const editModeBar = `<div class="edit-mode">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        header.style.marginTop = "88px";
        header.insertAdjacentHTML("afterbegin", editModeBar);

        /**change login text to switchLogout text */
        switchLogout.textContent = "logout";
        switchLogout.href = "#";

        switchLogout.addEventListener("click", () => {
            /**Delete the session token and reload the page */
            sessionStorage.removeItem("token");
            location.reload();
        });

        /**Create a <div> container for toModified and title "Mes Projets" */
        const containerDivBtn = document.createElement("div");
        containerDivBtn.classList.add("edit-projets");
        /**Create the <di> link to edit projects */
        const btnToModified = `<div class="edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </div>`;

        /**Insert container before first portfolio item and move projects inside */
        portfolio.insertBefore(containerDivBtn, portfolio.firstChild);
        containerDivBtn.appendChild(titlemyProjets);
        /**Insert edit link after projects */
        titlemyProjets.insertAdjacentHTML("afterend", btnToModified);

        /**Hide category buttons */
        const categoriesButtonsFilter = document.querySelectorAll('.category-btn');
        categoriesButtonsFilter.forEach(button => {
            button.style.display = 'none';
        });

        /**Access to "modifier" */
        const editBtn = document.querySelector(".edit");
        if (editBtn) {
            /**If the element is found, add an event listener for the click */
            editBtn.addEventListener("click", openFirstModal);
        };
    }
};

