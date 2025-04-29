// Indexpagina: Recepten tonen
document.addEventListener("DOMContentLoaded", function () {
    // Cache DOM-elementen
    const recipeCategories = document.getElementById("recipe-categories");
    const weeklyRecipe = document.getElementById("weekly-recipe");
    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-select");

    // Controleer essentiële elementen
    if (!recipeCategories || !weeklyRecipe || !searchInput || !categorySelect) {
        console.error("Een of meer DOM-elementen niet gevonden!");
        recipeCategories && (recipeCategories.innerHTML = "<p>Fout: Kan pagina niet laden.</p>");
        return;
    }

    // Controleer recept.html (optioneel, voor debugging)
    fetch("recept.html", { method: "HEAD" })
        .catch(() => console.warn("Waarschuwing: recept.html mogelijk niet toegankelijk"));

    fetch("recepten.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Kan recepten.json niet laden: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Controleer data.recepten
            if (!data.recepten || !Array.isArray(data.recepten)) {
                console.error("Geen geldige recepten in recepten.json:", data);
                recipeCategories.innerHTML = "<p>Fout: Geen recepten beschikbaar.</p>";
                return;
            }

            // Sorteer recepten alfabetisch
            const recipes = data.recepten.sort((a, b) => a.naam.localeCompare(b.naam));

            // Haal en sorteer subcategorieën alfabetisch
            const subcategories = [...new Set(recipes.map(recipe => recipe.subcategorie))].sort((a, b) => a.localeCompare(b));
            console.log("Gevonden subcategorieën:", subcategories);
            if (subcategories.length === 0) {
                console.warn("Geen subcategorieën gevonden in recepten.json!");
                recipeCategories.innerHTML = "<p>Fout: Geen categorieën beschikbaar.</p>";
                return;
            }

            // Vul dropdown-menu
            subcategories.forEach(subcategory => {
                const option = document.createElement("option");
                const displaySubcategory = subcategory === "Overig" ? "Algemene Gerechten" : subcategory;
                option.value = subcategory.toLowerCase().replace(/\s+/g, '-');
                option.textContent = displaySubcategory;
                categorySelect.appendChild(option);
            });

            // Scroll naar subcategorie bij selectie
            categorySelect.addEventListener("change", function () {
                const selectedCategory = this.value;
                if (selectedCategory) {
                    const section = document.getElementById(`category-${selectedCategory}`);
                    if (section) {
                        section.scrollIntoView({ behavior: "smooth", block: "start" });
                        // Sluit alle andere categorieën
                        document.querySelectorAll(".recipe-grid-rest").forEach(grid => {
                            grid.style.display = "none";
                        });
                        // Open de geselecteerde categorie
                        const tileGridRest = section.querySelector(".recipe-grid-rest");
                        if (tileGridRest) tileGridRest.style.display = "grid";
                    } else {
                        console.warn(`Sectie category-${selectedCategory} niet gevonden!`);
                    }
                }
            });

            // Gerecht van de Week
            const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
            const randomIndex = weekNumber % recipes.length;
            const weekly = recipes[randomIndex];
            weeklyRecipe.innerHTML = `
                <div class="weekly-tile">
                    <img src="${weekly.afbeelding || 'images/placeholder.jpg'}" alt="${weekly.naam}" loading="lazy">
                    <h3>${weekly.naam}</h3>
                    ${weekly.rijstsoort ? `<p class="rijstsoort">${weekly.rijstsoort}</p>` : ""}
                    <p>Calorieën: ${weekly.calorieën}</p>
                    <a href="/recept.html?id=${weekly.id}" class="weekly-button">Bekijk recept</a>
                </div>
            `;

            // Subcategorieweergave (één recept standaard, uitklapbaar)
            subcategories.forEach(subcategory => {
                const categorySection = document.createElement("section");
                categorySection.classList.add("category-section");
                categorySection.id = `category-${subcategory.toLowerCase().replace(/\s+/g, '-')}`;
                const displaySubcategory = subcategory === "Overig" ? "Algemene Gerechten" : subcategory;

                // Klikbare categoriekop
                const categoryHeader = document.createElement("h2");
                categoryHeader.textContent = displaySubcategory;
                categoryHeader.style.cursor = "pointer";
                categoryHeader.addEventListener("click", () => {
                    const tileGridRest = categorySection.querySelector(".recipe-grid-rest");
                    if (tileGridRest) {
                        // Sluit alle andere categorieën
                        document.querySelectorAll(".recipe-grid-rest").forEach(grid => {
                            if (grid !== tileGridRest) {
                                grid.style.display = "none";
                            }
                        });
                        // Toggle de huidige categorie
                        const isOpening = tileGridRest.style.display === "none";
                        tileGridRest.style.display = isOpening ? "grid" : "none";
                        // Scroll naar bovenkant van de categorie bij openen
                        if (isOpening) {
                            categorySection.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    }
                });

                categorySection.appendChild(categoryHeader);

                const subcategoryRecipes = recipes.filter(recipe => recipe.subcategorie === subcategory);
                if (subcategoryRecipes.length === 0) {
                    const tileGrid = document.createElement("div");
                    tileGrid.classList.add("recipe-grid");
                    tileGrid.innerHTML = `<p>Geen recepten beschikbaar in ${displaySubcategory}.</p>`;
                    categorySection.appendChild(tileGrid);
                } else {
                    // Container voor het eerste recept (altijd zichtbaar)
                    const tileGridFirst = document.createElement("div");
                    tileGridFirst.classList.add("recipe-grid-first");
                    const firstRecipe = subcategoryRecipes[0];
                    const tile = document.createElement("div");
                    tile.classList.add("recipe-tile");
                    const imgSrc = firstRecipe.afbeelding && firstRecipe.afbeelding !== "" ? firstRecipe.afbeelding : "images/placeholder.jpg";
                    tile.innerHTML = `
                        <img src="${imgSrc}" alt="${firstRecipe.naam}" loading="lazy">
                        <h3>${firstRecipe.naam}</h3>
                        ${firstRecipe.rijstsoort ? `<p class="rijstsoort">${firstRecipe.rijstsoort}</p>` : ""}
                    `;
                    tile.addEventListener("click", () => {
                        window.location.assign(`/recept.html?id=${firstRecipe.id}`);
                    });
                    tileGridFirst.appendChild(tile);
                    categorySection.appendChild(tileGridFirst);

                    // Container voor overige recepten (standaard verborgen)
                    if (subcategoryRecipes.length > 1) {
                        const tileGridRest = document.createElement("div");
                        tileGridRest.classList.add("recipe-grid-rest");
                        tileGridRest.style.display = "none"; // Standaard verborgen
                        subcategoryRecipes.slice(1).forEach(recipe => {
                            const tile = document.createElement("div");
                            tile.classList.add("recipe-tile");
                            const imgSrc = recipe.afbeelding && recipe.afbeelding !== "" ? recipe.afbeelding : "images/placeholder.jpg";
                            tile.innerHTML = `
                                <img src="${imgSrc}" alt="${recipe.naam}" loading="lazy">
                                <h3>${recipe.naam}</h3>
                                ${recipe.rijstsoort ? `<p class="rijstsoort">${recipe.rijstsoort}</p>` : ""}
                            `;
                            tile.addEventListener("click", () => {
                                window.location.assign(`/recept.html?id=${recipe.id}`);
                            });
                            tileGridRest.appendChild(tile);
                        });
                        categorySection.appendChild(tileGridRest);
                    }
                }

                recipeCategories.appendChild(categorySection);
            });

            // Voeg "Toon alle recepten" knop toe
            const showAllButton = document.createElement("button");
            showAllButton.textContent = "Toon alle recepten";
            showAllButton.className = "show-all-button";
            showAllButton.addEventListener("click", () => {
                document.querySelectorAll(".recipe-grid-rest").forEach(grid => {
                    grid.style.display = "grid";
                });
            });
            recipeCategories.insertBefore(showAllButton, recipeCategories.firstChild);

            // Zoekfunctionaliteit (geoptimaliseerd voor uitklapbare categorieën)
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.toLowerCase();
                const allSections = document.querySelectorAll(".category-section");
                allSections.forEach(section => {
                    const tiles = section.querySelectorAll(".recipe-tile");
                    let hasVisibleTiles = false;
                    tiles.forEach(tile => {
                        const name = tile.querySelector("h3").textContent.toLowerCase();
                        const rijstsoort = tile.querySelector(".rijstsoort")?.textContent.toLowerCase() || "";
                        const isVisible = name.includes(query) || rijstsoort.includes(query);
                        tile.style.display = isVisible ? "block" : "none";
                        if (isVisible) hasVisibleTiles = true;
                    });
                    const tileGridRest = section.querySelector(".recipe-grid-rest");
                    if (tileGridRest) {
                        tileGridRest.style.display = hasVisibleTiles ? "grid" : "none";
                    }
                    section.style.display = hasVisibleTiles ? "block" : "none";
                });
            });
        })
        .catch(error => {
            console.error("Fout bij laden recepten:", error);
            recipeCategories.innerHTML = `<p>Sorry, recepten konden niet worden geladen. Controleer of recepten.json aanwezig is.</p>`;
        });
});

// Recept details ophalen
function getRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");
    if (!recipeId) {
        console.error("Geen recept-ID in URL!");
        document.body.innerHTML = "<p>Fout: Geen recept geselecteerd.</p>";
        return;
    }

    fetch("recepten.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Kan recepten.json niet laden: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const recipe = data.recepten.find(r => r.id === recipeId);
            if (!recipe) {
                console.error(`Recept met ID ${recipeId} niet gevonden!`);
                document.body.innerHTML = "<p>Fout: Recept niet gevonden.</p>";
                return;
            }

            // Valideer DOM-elementen
            const recipeImage = document.getElementById("recipe-image");
            const recipeTitle = document.getElementById("recipe-title");
            const ingredientsList = document.getElementById("ingredients-list");
            const instructionsList = document.getElementById("instructions-list");
            if (!recipeImage || !recipeTitle || !ingredientsList || !instructionsList) {
                console.error("Recept DOM-elementen niet gevonden!");
                return;
            }

            recipeImage.src = recipe.afbeelding || "images/placeholder.jpg";
            recipeImage.setAttribute("loading", "lazy");
            recipeTitle.textContent = recipe.naam;
            ingredientsList.innerHTML = recipe.ingrediënten
                .map(ing => `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`)
                .join("");
            instructionsList.innerHTML = recipe.bereiding
                .map(step => `<li>${step}</li>`)
                .join("");

            // Voedingswaarden
            const nutritionFields = [
                { id: "calories", value: `Calorieën: ${recipe.calorieën}` },
                { id: "total-fat", value: `Totaal vet: ${recipe.totaal_vet}` },
                { id: "saturated-fat", value: `Verzadigd vet: ${recipe.verzadigd_vet}` },
                { id: "cholesterol", value: `Cholesterol: ${recipe.cholesterol}` },
                { id: "sodium", value: `Natrium: ${recipe.natrium}` },
                { id: "total-carbohydrate", value: `Totaal Koolhydraten: ${recipe.totaal_koolhydraten}` },
                { id: "dietary-fiber", value: `Voedingsvezels: ${recipe.voedingsvezels}` },
                { id: "sugars", value: `Suikers: ${recipe.suikers}` },
                { id: "protein", value: `Eiwit: ${recipe.eiwit}` }
            ];
            nutritionFields.forEach(field => {
                const element = document.getElementById(field.id);
                if (element) element.textContent = field.value;
            });

            // Rijstinfo
            const riceInfo = document.getElementById("rice-type");
            if (riceInfo) {
                riceInfo.textContent = recipe.rijstsoort
                    ? `Gebruik: ${recipe.rijstsoort}. Check onze app voor de perfecte bereiding!`
                    : `Check onze app voor de perfecte bereiding!`;
            }
        })
        .catch(error => {
            console.error("Fout bij laden recept details:", error);
            document.body.innerHTML = "<p>Fout: Kan recept niet laden.</p>";
        });
}

// Portiegrootte aanpassen
document.addEventListener("DOMContentLoaded", function () {
    const updateButton = document.getElementById("update-portion");
    if (!updateButton) return;

    updateButton.addEventListener("click", function () {
        const portionSizeInput = document.getElementById("portion-size")?.value.replace(",", ".");
        const portionSize = parseFloat(portionSizeInput) || 1;

        fetch("recepten.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Kan recepten.json niet laden: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const urlParams = new URLSearchParams(window.location.search);
                const recipeId = urlParams.get("id");
                const recipe = data.recepten.find(r => r.id === recipeId);
                if (!recipe) {
                    console.error(`Recept met ID ${recipeId} niet gevonden!`);
                    return;
                }

                // Schaal ingrediënten
                const ingredientsList = document.getElementById("ingredients-list");
                if (ingredientsList) {
                    ingredientsList.innerHTML = recipe.ingrediënten
                        .map(ing => {
                            const scaledAmount = ing.amount * portionSize;
                            const roundedAmount = Math.round(scaledAmount * 4) / 4;
                            return `<li>${roundedAmount} ${ing.unit} ${ing.name}</li>`;
                        })
                        .join("");
                }

                // Schaal voedingswaarden
                const scaleNutritionValue = (value) => {
                    if (value === "-") return "-";
                    const match = value.match(/^(\d+\.?\d*)(g|mg)?$/);
                    if (!match) return value;
                    const number = parseFloat(match[1]);
                    const unit = match[2] || "";
                    return `${Math.round(number * portionSize)}${unit}`;
                };

                const nutritionFields = [
                    { id: "calories", value: recipe.calorieën },
                    { id: "total-fat", value: recipe.totaal_vet },
                    { id: "saturated-fat", value: recipe.verzadigd_vet },
                    { id: "cholesterol", value: recipe.cholesterol },
                    { id: "sodium", value: recipe.natrium },
                    { id: "total-carbohydrate", value: recipe.totaal_koolhydraten },
                    { id: "dietary-fiber", value: recipe.voedingsvezels },
                    { id: "sugars", value: recipe.suikers },
                    { id: "protein", value: recipe.eiwit }
                ];
                nutritionFields.forEach(field => {
                    const element = document.getElementById(field.id);
                    if (element) element.textContent = `${field.id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}: ${scaleNutritionValue(field.value)}`;
                });
            })
            .catch(error => console.error("Fout bij portieberekening:", error));
    });
});

// Voer getRecipeDetails uit op recept.html
if (window.location.pathname.includes("recept.html")) {
    getRecipeDetails();
}