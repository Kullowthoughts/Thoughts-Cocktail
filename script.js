const grid = document.getElementById("cocktailGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.getElementById("closeBtn");
const rouletteBtn = document.getElementById("rouletteBtn");

// Load homepage cocktails
window.addEventListener("DOMContentLoaded", loadHomeCocktails);

async function loadHomeCocktails() {
  const categories = ["Ordinary_Drink", "Cocktail"];
  grid.innerHTML = "";

  for (let category of categories) {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await response.json();

    data.drinks.slice(0, 6).forEach(drink => createCard(drink));
  }
}

// Search functionality
searchBtn.addEventListener("click", searchCocktails);
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") searchCocktails();
});

async function searchCocktails() {
  const query = searchInput.value.trim();
  if (!query) return;

  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`
  );
  const data = await response.json();

  grid.innerHTML = "";

  if (!data.drinks) {
    grid.innerHTML = "<p style='text-align:center;'>No cocktails found.</p>";
    return;
  }

  data.drinks.forEach(drink => createCard(drink));
}

// Create cocktail card with button
function createCard(drink) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
    <h3>${drink.strDrink}</h3>
    <button class="view-btn">View Ingredients</button>
  `;

  const button = card.querySelector(".view-btn");
  button.addEventListener("click", () => fetchFullDetails(drink.idDrink));

  grid.appendChild(card);
}

// Fetch full details
async function fetchFullDetails(id) {
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  openModal(data.drinks[0]);
}

// Open modal
function openModal(drink) {
  let ingredients = "";

  for (let i = 1; i <= 15; i++) {
    if (drink[`strIngredient${i}`]) {
      ingredients += `
        <div class="ingredient-pill">
          <span class="ingredient-name">${drink[`strIngredient${i}`]}</span>
          <span class="ingredient-measure">${drink[`strMeasure${i}`] || ""}</span>
        </div>
      `;
    }
  }

  modalBody.innerHTML = `
    <h2>${drink.strDrink}</h2>
    <img src="${drink.strDrinkThumb}">
    <h3>Ingredients</h3>
    <div class="ingredients-wrapper">${ingredients}</div>
    <h3>Instructions</h3>
    <p class="instructions-text">${drink.strInstructions}</p>
  `;

  modal.classList.remove("hidden");
}

// Close modal
closeBtn.onclick = () => modal.classList.add("hidden");
modal.onclick = e => {
  if (e.target === modal) modal.classList.add("hidden");
};

// ------------------- Roulette -------------------
rouletteBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();
    if (data.drinks && data.drinks[0]) {
      openModal(data.drinks[0]);
    }
  } catch (error) {
    console.error("Failed to fetch random cocktail:", error);
    alert("Oops! Could not get a random cocktail. Try again.");
  }
});
