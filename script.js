document.addEventListener("DOMContentLoaded", () => {
    const recipeGrid = document.getElementById("recipe-grid");
    const recipeTitle = document.getElementById("recipe-title");
    const recipeCategory = document.getElementById("recipe-category");
    const recipeImage = document.getElementById("recipe-image");
    const ingredientsList = document.getElementById("ingredients-list");
    const instructionsList = document.getElementById("instructions-list");
    const portionSize = document.getElementById("portion-size");

    if (recipeGrid) {
        fetch("https://edro01.github.io/recepten-website/recepten.json")
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
    } else if (recipeTitle && ingredientsList && instructionsList && portionSize && recipeImage) {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get("id");

        if (!recipeId) {
            recipeTitle.textContent = "Recept niet gevonden!";
            return;
        }

        fetch("https://edro01.github.io/recepten-website/recepten.json")
            .then(response => response.json())
            .then(data => {
                const recipe = data.find(r => r.id === recipeId);

                if (!recipe) {
                    recipeTitle.textContent = "Recept niet gevonden!";
                    return;
                }

                recipeTitle.textContent = recipe.naam;
                recipeImage.src = recipe.afbeelding;
                recipeImage.alt = recipe.naam;

                function updateIngredients() {
                    const portionMultiplier = parseFloat(portionSize.value);
                    ingredientsList.innerHTML = "";

                    recipe.ingrediënten.forEach(item => {
                        let li = document.createElement("li");
                        const match = item.match(/^(\d+)(.*)$/);
                        if (match) {
                            const amount = parseFloat(match[1]) * portionMultiplier;
                            li.textContent = `${amount}${match[2]}`;
                        } else {
                            li.textContent = item;
                        }
                        ingredientsList.appendChild(li);
                    });
                }

                portionSize.addEventListener("input", updateIngredients);
                updateIngredients();

                instructionsList.innerHTML = "";
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
