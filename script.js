// Indexpagina: Recepten tonen
document.addEventListener("DOMContentLoaded", function () {
    fetch("recepten.json")
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.getElementById("recipe-grid");

            if (!recipeGrid) {
                console.error("Element #recipe-grid niet gevonden!");
                return;
            }

            // Sorteer recepten alfabetisch op naam
            data.recepten.sort((a, b) => a.naam.localeCompare(b.naam));

            data.recepten.forEach(recipe => {
                const tile = document.createElement("div");
                tile.classList.add("recipe-tile");
                tile.innerHTML = `
                    <img src="${recipe.afbeelding}" alt="${recipe.naam}">
                    <h3><div class="title-text">${recipe.naam}</div></h3>
                `;
                tile.addEventListener("click", function () {
                    window.location.href = `recept.html?id=${recipe.id}`;
                });

                recipeGrid.appendChild(tile);
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
                // Vul beide afbeeldingen met dezelfde URL
                document.getElementById("recipe-image").src = recipe.afbeelding;
                const largeImage = document.getElementById("large-recipe-image");
                if (largeImage) {
                    largeImage.src = recipe.afbeelding;
                }

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

                const calorieElement = document.getElementById("calories");
                calorieElement.textContent = `Calorieën: ${recipe.calorieën}`;
            }
        }).catch(error => console.error("Fout bij laden recept details:", error));
}

if (window.location.pathname.includes("recept.html")) {
    getRecipeDetails();
}

// Hulpfunctie om hoeveelheden af te ronden naar werkbare eenheden
function roundToWorkableUnit(amount, unit) {
    const smallUnits = ["theelepel", "theelepels", "eetlepel", "eetlepels", "snufje", "mespunt"];
    const countUnits = ["stuks", "stengels", "tenen", "plakken", "schijven"];
    const weightVolumeUnits = ["gram", "ml", "milliliter", "liter", "kilo", "kg"];

    if (smallUnits.some(smallUnit => unit.toLowerCase().includes(smallUnit))) {
        return Math.round(amount * 4) / 4;
    } else if (countUnits.some(countUnit => unit.toLowerCase().includes(countUnit))) {
        return Math.round(amount * 2) / 2;
    } else if (weightVolumeUnits.some(weightUnit => unit.toLowerCase().includes(weightUnit))) {
        return Math.round(amount * 4) / 4;
    } else {
        return parseFloat(amount.toFixed(2));
    }
}

// Portiegrootte aanpassen
document.addEventListener("DOMContentLoaded", function () {
    const updateButton = document.getElementById("update-portion");

    if (!updateButton) {
        console.warn("Element #update-portion niet gevonden! Dit is normaal op de indexpagina.");
        return;
    }

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
                    const ingredientsList = document.getElementById("ingredients-list");
                    ingredientsList.innerHTML = "";

                    recipe.ingrediënten.forEach(ingredient => {
                        const li = document.createElement("li");
                        const parts = ingredient.split(" ");
                        const firstPart = parts[0];
                        const amount = parseFloat(firstPart.replace(",", "."));

                        if (!isNaN(amount)) {
                            const scaledAmount = amount * portionSize;
                            const restOfIngredient = parts.slice(1).join(" ");
                            const unit = restOfIngredient.split(" ")[0] || "";
                            const roundedAmount = roundToWorkableUnit(scaledAmount, unit);
                            const formattedAmount = roundedAmount.toString().replace(".", ",");
                            li.textContent = `${formattedAmount} ${restOfIngredient}`;
                        } else {
                            li.textContent = ingredient;
                        }

                        ingredientsList.appendChild(li);
                    });

                    const calorieElement = document.getElementById("calories");
                    const scaledCalories = Math.round(recipe.calorieën * portionSize);
                    calorieElement.textContent = `Calorieën: ${scaledCalories}`;
                }
            }).catch(error => console.error("Fout bij portieberekening:", error));
    });
});