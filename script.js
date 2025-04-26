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
    // Eenheden die in stappen van 0,25 moeten worden afgerond (kleine hoeveelheden)
    const smallUnits = ["theelepel", "theelepels", "eetlepel", "eetlepels", "snufje", "mespunt"];
    // Eenheden die in stappen van 0,5 moeten worden afgerond (telling)
    const countUnits = ["stuks", "stengels", "tenen", "plakken", "schijven"];
    // Eenheden die in stappen van 0,25 moeten worden afgerond (gewicht/volume)
    const weightVolumeUnits = ["gram", "ml", "milliliter", "liter", "kilo", "kg"];

    if (smallUnits.some(smallUnit => unit.toLowerCase().includes(smallUnit))) {
        // Rond af naar de dichtstbijzijnde 0,25 (bijv. 1,875 → 1,75)
        return Math.round(amount * 4) / 4;
    } else if (countUnits.some(countUnit => unit.toLowerCase().includes(countUnit))) {
        // Rond af naar de dichtstbijzijnde 0,5 (bijv. 1,3 → 1,5)
        return Math.round(amount * 2) / 2;
    } else if (weightVolumeUnits.some(weightUnit => unit.toLowerCase().includes(weightUnit))) {
        // Rond af naar de dichtstbijzijnde 0,25 (bij