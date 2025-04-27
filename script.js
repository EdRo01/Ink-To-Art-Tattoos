// Indexpagina: Recepten tonen
document.addEventListener("DOMContentLoaded", function () {
    fetch("recepten.json")
        .then(response => response.json())
        .then(data => {
            const recipeCategories = document.getElementById("recipe-categories");
            const weeklyRecipe = document.getElementById("weekly-recipe");
            const searchInput = document.getElementById("search-input");

            if (!recipeCategories || !weeklyRecipe) {
                console.error("Elementen niet gevonden!");
                return;
            }

            // Sorteer recepten alfabetisch
            data.recepten.sort((a, b) => a.naam.localeCompare(b.naam));

            // Debug: Log categorieën
            const categories = [...new Set(data.recepten.map(recipe => recipe.categorie))];
            console.log("Gevonden categorieën:", categories);

            // Gerecht van de Week
            const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
            const randomIndex = weekNumber % data.recepten.length;
            const weekly = data.recepten[randomIndex];
            weeklyRecipe.innerHTML = `
                <div class="weekly-tile">
                    <img src="${weekly.afbeelding}" alt="${weekly.naam}">
                    <h3>${weekly.naam}</h3>
                    ${weekly.rijstsoort ? `<p class="rijstsoort">${weekly.rijstsoort}</p>` : ""}
                    <p>Calorieën: ${weekly.calorieën}</p>
                    <a href="recept.html?id=${weekly.id}">Bekijk recept</a>
                </div>
            `;

            // Categorieweergave
            categories.forEach(category => {
                const categorySection = document.createElement("section");
                categorySection.classList.add("category-section");
                // Gebruik subcategorie als fallback voor "Overig"
                const displayCategory = category === "Overig" ? "Algemeen" : category;
                categorySection.innerHTML = `<h2>${displayCategory}</h2>`;
                const tileGrid = document.createElement("div");
                tileGrid.classList.add("recipe-grid");

                const categoryRecipes = data.recepten.filter(recipe => recipe.categorie === category);
                categoryRecipes.forEach(recipe => {
                    const tile = document.createElement("div");
                    tile.classList.add("recipe-tile");
                    tile.innerHTML = `
                        <img src="${recipe.afbeelding}" alt="${recipe.naam}">
                        <h3>${recipe.naam}</h3>
                        ${recipe.rijstsoort ? `<p class="rijstsoort">${recipe.rijstsoort}</p>` : ""}
                    `;
                    tile.addEventListener("click", () => {
                        window.location.href = `recept.html?id=${recipe.id}`;
                    });
                    tileGrid.appendChild(tile);
                });

                categorySection.appendChild(tileGrid);
                recipeCategories.appendChild(categorySection);
            });

            // Zoekfunctionaliteit
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.toLowerCase();
                recipeCategories.innerHTML = "";
                categories.forEach(category => {
                    const filteredRecipes = data.recepten.filter(r =>
                        r.categorie === category && (
                            r.naam.toLowerCase().includes(query) ||
                            r.rijstsoort.toLowerCase().includes(query) ||
                            r.categorie.toLowerCase().includes(query) ||
                            r.subcategorie.toLowerCase().includes(query)
                        )
                    );
                    if (filteredRecipes.length > 0) {
                        const categorySection = document.createElement("section");
                        categorySection.classList.add("category-section");
                        const displayCategory = category === "Overig" ? "Algemeen" : category;
                        categorySection.innerHTML = `<h2>${displayCategory}</h2>`;
                        const tileGrid = document.createElement("div");
                        tileGrid.classList.add("recipe-grid");
                        filteredRecipes.forEach(recipe => {
                            const tile = document.createElement("div");
                            tile.classList.add("recipe-tile");
                            tile.innerHTML = `
                                <img src="${recipe.afbeelding}" alt="${recipe.naam}">
                                <h3>${recipe.naam}</h3>
                                ${recipe.rijstsoort ? `<p class="rijstsoort">${recipe.rijstsoort}</p>` : ""}
                            `;
                            tile.addEventListener("click", () => {
                                window.location.href = `recept.html?id=${recipe.id}`;
                            });
                            tileGrid.appendChild(tile);
                        });
                        categorySection.appendChild(tileGrid);
                        recipeCategories.appendChild(categorySection);
                    }
                });
            });
        }).catch(error => console.error("Fout bij laden recepten:", error));
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
                recipe.ingrediënten.forEach(ing => {
                    const li = document.createElement("li");
                    li.textContent = `${ing.amount} ${ing.unit} ${ing.name}`.trim();
                    ingredientsList.appendChild(li);
                });

                const instructionsList = document.getElementById("instructions-list");
                instructionsList.innerHTML = "";
                recipe.bereiding.forEach(step => {
                    const li = document.createElement("li");
                    li.textContent = step;
                    instructionsList.appendChild(li);
                });

                document.getElementById("calories").textContent = `Calorieën: ${recipe.calorieën}`;
                document.getElementById("total-fat").textContent = `Totaal vet: ${recipe.totaal_vet}`;
                document.getElementById("saturated-fat").textContent = `Verzadigd vet: ${recipe.verzadigd_vet}`;
                document.getElementById("cholesterol").textContent = `Cholesterol: ${recipe.cholesterol}`;
                document.getElementById("sodium").textContent = `Natrium: ${recipe.natrium}`;
                document.getElementById("total-carbohydrate").textContent = `Totaal Koolhydraten: ${recipe.totaal_koolhydraten}`;
                document.getElementById("dietary-fiber").textContent = `Voedingsvezels: ${recipe.voedingsvezels}`;
                document.getElementById("sugars").textContent = `Suikers: ${recipe.suikers}`;
                document.getElementById("protein").textContent = `Eiwit: ${recipe.eiwit}`;

                // Rijstinfo
                const riceInfo = document.getElementById("rice-type");
                if (riceInfo && recipe.rijstsoort) {
                    riceInfo.textContent = `Gebruik: ${recipe.rijstsoort}. Check onze app voor de perfecte bereiding!`;
                }
            }
        }).catch(error => console.error("Fout bij laden recept details:", error));
}

if (window.location.pathname.includes("recept.html")) {
    getRecipeDetails();
}

// Portiegrootte aanpassen
document.addEventListener("DOMContentLoaded", function () {
    const updateButton = document.getElementById("update-portion");
    if (!updateButton) return;

    updateButton.addEventListener("click", function () {
        let portionSizeInput = document.getElementById("portion-size").value;
        portionSizeInput = portionSizeInput.replace(",", ".");
        const portionSize = parseFloat(portionSizeInput) || 1;

        fetch("recepten.json")
            .then(response => response.json())
            .then(data => {
                const urlParams = new URLSearchParams(window.location.search);
                const recipeId = urlParams.get("id");
                const recipe = data.recepten.find(r => r.id === recipeId);

                if (recipe) {
                    // Schaal ingrediënten
                    const ingredientsList = document.getElementById("ingredients-list");
                    ingredientsList.innerHTML = "";
                    recipe.ingrediënten.forEach(ing => {
                        const li = document.createElement("li");
                        const scaledAmount = ing.amount * portionSize;
                        const roundedAmount = Math.round(scaledAmount * 4) / 4;
                        li.textContent = `${roundedAmount} ${ing.unit} ${ing.name}`.trim();
                        ingredientsList.appendChild(li);
                    });

                    // Schaal voedingswaarden
                    const scaleNutritionValue = (value) => {
                        if (value === "-") return "-";
                        const match = value.match(/^(\d+\.?\d*)(g|mg)?$/);
                        if (!match) return value;
                        const number = parseFloat(match[1]);
                        const unit = match[2] || "";
                        return `${Math.round(number * portionSize)}${unit}`;
                    };

                    document.getElementById("calories").textContent = `Calorieën: ${scaleNutritionValue(recipe.calorieën)}`;
                    document.getElementById("total-fat").textContent = `Totaal vet: ${scaleNutritionValue(recipe.totaal_vet)}`;
                    document.getElementById("saturated-fat").textContent = `Verzadigd vet: ${scaleNutritionValue(recipe.verzadigd_vet)}`;
                    document.getElementById("cholesterol").textContent = `Cholesterol: ${scaleNutritionValue(recipe.cholesterol)}`;
                    document.getElementById("sodium").textContent = `Natrium: ${scaleNutritionValue(recipe.natrium)}`;
                    document.getElementById("total-carbohydrate").textContent = `Totaal Koolhydraten: ${scaleNutritionValue(recipe.totaal_koolhydraten)}`;
                    document.getElementById("dietary-fiber").textContent = `Voedingsvezels: ${scaleNutritionValue(recipe.voedingsvezels)}`;
                    document.getElementById("sugars").textContent = `Suikers: ${scaleNutritionValue(recipe.suikers)}`;
                    document.getElementById("protein").textContent = `Eiwit: ${scaleNutritionValue(recipe.eiwit)}`;
                }
            }).catch(error => console.error("Fout bij portieberekening:", error));
    });
});