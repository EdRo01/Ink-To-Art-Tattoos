document.addEventListener("DOMContentLoaded", () => {
    const recipeGrid = document.getElementById("recipe-grid");
    const recipeTitle = document.getElementById("recipe-title");
    const recipeCategory = document.getElementById("recipe-category");
    const recipeImage = document.getElementById("recipe-image");
    const ingredientsList = document.getElementById("ingredients-list");
    const instructionsList = document.getElementById("instructions-list");

    // Controleer of we op de indexpagina of de receptpagina zitten
    if (recipeGrid) {
        fetch("recepten.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(recipe => {
                    const recipeTile = document.createElement("div");
                    recipeTile.classList.add("recipe-tile");
                    recipeTile.innerHTML = `
                        <a href="recept.html?id=${recipe.id}">
                            <img src="${recipe.afbeelding}" alt="${recipe.naam}">
                            <h3>${recipe.naam}</h3>
                        </a>
                    `;
                    recipeGrid.appendChild(recipeTile);
                });
            })
            .catch(error => console.error("Fout bij laden recepten:", error));
    } else if (recipeTitle && recipeCategory && recipeImage && ingredientsList && instructionsList) {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get("id");

        if (!recipeId) {
            recipeTitle.textContent = "Recept niet gevonden!";
            return;
        }

        fetch("recepten.json")
            .then(response => response.json())
            .then(data => {
                const recipe = data.find(r => r.id === recipeId);

                if (!recipe) {
                    recipeTitle.textContent = "Recept niet gevonden!";
                    return;
                }

                // Vul de receptinformatie
                recipeTitle.textContent = recipe.naam;
                recipeCategory.textContent = recipe.categorie;
                recipeImage.src = recipe.afbeelding;
                recipeImage.alt = recipe.naam;

                // Vul de ingrediëntenlijst
                recipe.ingrediënten.forEach(item => {
                    let li = document.createElement("li");
                    li.textContent = item;
                    ingredientsList.appendChild(li);
                });

                // Vul de bereidingslijst
                recipe.bereiding.forEach(step => {
                    let li = document.createElement("li");
                    li.textContent = step;
                    instructionsList.appendChild(li);
                });
            })
            .catch(error => console.error("Fout bij laden recepten:", error));
    } else {
        console.error("Benodigde elementen niet gevonden!");
    }
});
