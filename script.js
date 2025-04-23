document.addEventListener("DOMContentLoaded", function () {
    fetch("recepten.json")
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.getElementById("recipe-grid");

            data.recepten.forEach(recipe => {
                const tile = document.createElement("div");
                tile.classList.add("recipe-tile");
                tile.innerHTML = `
                    <img src="${recipe.afbeelding}" alt="${recipe.naam}">
                    <h3>${recipe.naam}</h3>
                `;
                tile.addEventListener("click", function () {
                    window.location.href = `recept.html?id=${recipe.id}`;
                });

                recipeGrid.appendChild(tile);
            });
        });
});

// Recept details ophalen
function getRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    fetch("recepten.json")
        .then(response => response.json())
        .then(data => {
            const recipe = data.recepten.find(r => r.id === recipeId);

            if (recipe) {
                document.getElementById("recipe-image").src = recipe.afbeelding;
                document.getElementById("recipe-title").textContent = recipe.naam;

                const ingredientsList = document.getElementById("ingredients-list");
                ingredientsList.innerHTML = "";
                recipe.ingrediënten.forEach(ingredient => {
                    const li = document.createElement("li");
                    li.textContent = ingredient;
                    ingredientsList.appendChild(li);
                });

                const instructionsList = document.getElementById("instructions-list");
                instructionsList.innerHTML = "";
                recipe.bereiding.forEach(step => {
                    const li = document.createElement("li");
                    li.textContent = step;
                    instructionsList.appendChild(li);
                });
            }
        });
}

if (window.location.pathname.includes("recept.html")) {
    getRecipeDetails();
}

// Portiegrootte aanpassen
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("update-portion").addEventListener("click", function () {
        const portionSize = parseFloat(document.getElementById("portion-size").value);

        fetch("recepten.json")
            .then(response => response.json())
            .then(data => {
                const urlParams = new URLSearchParams(window.location.search);
                const recipeId = urlParams.get("id");
                const recipe = data.recepten.find(r => r.id === recipeId);

                if (recipe) {
                    const ingredientsList = document.getElementById("ingredients-list");
                    ingredientsList.innerHTML = "";

                    recipe.ingrediënten.forEach(ingredient => {
                        const hoeveelheid = parseFloat(ingredient.split(" ")[0]) * portionSize;
                        const li = document.createElement("li");
                        li.textContent = `${hoeveelheid} ${ingredient.split(" ").slice(1).join(" ")}`;
                        ingredientsList.appendChild(li);
                    });
                }
            });
    });
});
