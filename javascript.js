function loadCategories() {
  fetch('http://localhost:5678/api/categories') // URL de l'API pour récupérer les catégories
    .then(response => response.json())
    .then(data => {
      displayFilterButtons(data);
    })
    .catch(error => console.error('Erreur lors du chargement des catégories:', error));
}

function displayFilterButtons(categories) {
  const filterButtonsDiv = document.getElementById('filter-buttons');

  // Ajouter le bouton "Tous" en premier
  filterButtonsDiv.innerHTML += `<button class="filter-btns" onclick="filterItems('all')">Tous</button>`;

  categories.forEach(category => {
    filterButtonsDiv.innerHTML += `<button class="filter-btns" onclick="filterItems(${category.id})">${category.name}</button>`;
  });
}

function loadItems() {
  fetch('http://localhost:5678/api/works') // URL de l'API pour récupérer les éléments
    .then(response => response.json())
    .then(data => {
      displayItems(data);
    })
    .catch(error => console.error('Erreur lors du chargement des éléments:', error));
}

function displayItems(items) {
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = ''; // Effacer le contenu actuel

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
    loadItems(); // Charger tous les éléments
  } else {
    fetch('http://localhost:5678/api/works') // URL de l'API pour récupérer les éléments
      .then(response => response.json())
      .then(data => {
        const filteredItems = data.filter(item => item.category.id === categoryId);
        displayItems(filteredItems);
      })
      .catch(error => console.error('Erreur lors du filtrage des éléments:', error));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Vérifier si l'utilisateur est connecté
  var isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (isLoggedIn) {
      // Masquer les boutons de filtre
      const filterButtonsDiv = document.getElementById('filter-buttons');
      filterButtonsDiv.style.display = 'none';
  }

  // Supprimer les boutons de filtre
  const filterButtonsDiv = document.getElementById('filter-buttons');
  filterButtonsDiv.innerHTML = '';

  // Charger les catégories et les éléments
  loadCategories();
  loadItems();

  // Créer le bouton Modifier
  const modifierButton = document.createElement("button");
  // Créer l'icône
  const iconElement = document.createElement("i");
  iconElement.classList.add("fa-regular", "fa-pen-to-square");
  // Ajouter l'icône avant le texte "modifier"
  modifierButton.appendChild(iconElement);
  // Ajouter du texte "modifier" après l'icône
  modifierButton.innerHTML += " modifier";
  // Ajouter la classe au bouton
  modifierButton.classList.add("modifier-button");

  modifierButton.onclick = function() {
    // Ouvrir la fenêtre modale ici
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Créer une nouvelle section pour ajouter une photo
    var addPhotoSection = document.createElement("div");
    addPhotoSection.classList.add("add-photo-section");

    // Ajouter du texte
    var addPhotoText = document.createElement("p");
    addPhotoText.textContent = "Ajouter une photo :";
    addPhotoSection.appendChild(addPhotoText);

    // Ajouter le bouton pour ajouter une photo
    var addPhotoButton = document.createElement("button");
    addPhotoButton.textContent = "Sélectionner une photo";
    addPhotoButton.classList.add("add-photo-button");

    // Gérer le clic sur le bouton "Ajouter une photo"
    addPhotoButton.onclick = function() {
      // Ouvrir la boîte de dialogue de sélection de fichier
      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = function(event) {
        // Ici, vous pouvez traiter la photo sélectionnée
        var selectedPhoto = event.target.files[0];
        console.log("Photo sélectionnée:", selectedPhoto);
        // Fermer la modale ou effectuer d'autres actions si nécessaire
      };
      fileInput.click();
    };
    addPhotoSection.appendChild(addPhotoButton);

    // Effacer le contenu précédent de modalImageContainer
    var modalImageContainer = document.getElementById('modal-image-container');
    modalImageContainer.innerHTML = '';

    // Charger les images dans la modale
    var images = document.querySelectorAll('#item-list .item img');
    var groupSize = 5; // Taille du groupe d'images
    var groupCount = Math.ceil(images.length / groupSize); // Nombre total de groupes

    for (var i = 0; i < groupCount; i++) {
      var groupContainer = document.createElement('div');
      groupContainer.classList.add('image-group');

      for (var j = i * groupSize; j < (i + 1) * groupSize && j < images.length; j++) {
        var img = document.createElement('img');
        img.src = images[j].src;
        img.style.width = '100px'; // Largeur de chaque image
        img.style.height = '140px'; // Hauteur de chaque image
        groupContainer.appendChild(img);
      }

      modalImageContainer.appendChild(groupContainer);
    }
  };

  // Sélectionner l'élément où vous souhaitez ajouter le bouton Modifier
  var mesProjetsDiv = document.querySelector('#portfolio > div');

  // Ajouter le bouton Modifier à cet élément
  mesProjetsDiv.appendChild(modifierButton);

  // Ajouter un bouton pour ajouter des photos dans la modale
  var addPhotoButton = document.createElement("button");
  addPhotoButton.textContent = "Ajouter une photo";
  addPhotoButton.id = "add-photo-button"; // Ajout de l'identifiant pour le sélectionner facilement
  addPhotoButton.classList.add("add-photo-button");
  addPhotoButton.onclick = function() {
    // Sélectionner le bouton "Ajouter une photo"
    var addPhotoButton = document.getElementById("add-photo-button");

    // Gérer le clic sur le bouton "Ajouter une photo"
    addPhotoButton.addEventListener("click", function() {
      // Créer un élément input de type file pour sélectionner un fichier image
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*"; // Accepter uniquement les fichiers image

      // Gérer le changement de fichier sélectionné
      input.addEventListener("change", function() {
        var file = input.files[0]; // Récupérer le premier fichier sélectionné
        if (file) {
          // Créer un objet FileReader pour lire le contenu du fichier image
          var reader = new FileReader();
          reader.onload = function(event) {
            // Créer un élément img pour afficher l'image sélectionnée
            var img = document.createElement("img");
            img.src = event.target.result; // Utiliser les données de l'image lue
            img.style.maxWidth = "100%"; // Limiter la largeur de l'image à 100% de la largeur de la modale
            img.style.height = "auto"; // Ajuster automatiquement la hauteur pour maintenir les proportions

            // Ajouter l'image à la modale
            var modalImageContainer = document.getElementById("modal-image-container");
            modalImageContainer.appendChild(img);
          };
          // Lire le contenu du fichier image en tant que URL de données
          reader.readAsDataURL(file);
        }
      });

      // Cliquer sur l'élément input pour ouvrir la boîte de dialogue de sélection de fichier
      input.click();
    });
  };
  // Ajouter le bouton "Ajouter une photo" à la modale
  var modalContent = document.querySelector('.modal-content');
  modalContent.appendChild(addPhotoButton);

  // Effacer l'indicateur une fois le bouton ajouté
  sessionStorage.removeItem("isLoggedIn");

  // Gérer la fermeture de la modale lorsque l'utilisateur clique sur la croix
  var closeBtn = document.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
    });
  }
});

/*Ajout du boutton pour ajouter photos*/









