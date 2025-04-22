document.addEventListener("DOMContentLoaded", () => {
    console.log("Script geladen!");

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");
    console.log("Recipe ID opgehaald:", recipeId);

    if (!recipeId) {
        console.log("Geen recept-ID gevonden! Laden van indexpagina...");
        loadRecipeGrid();
        return;
    }

    loadRecipeDetails(recipeId);
});

function loadRecipeGrid() {
    const recipeGrid = document.getElementById("recipe-grid");

    if (!recipeGrid) {
        console.error("Element 'recipe-grid' niet gevonden!");
        return;
    }

    fetch("https://edro01.github.io/recepten-website/recepten.json")
        .then(response => response.json())
        .then(data => {
            console.log("Ontvangen data:", data);

            if (!Array.isArray(data)) {
                console.error("Data is geen array! Mogelijk moet data.recepten worden gebruikt.");
                data = data.recepten || [];
            }

            recipeGrid.innerHTML = "";

            data.sort((a, b) => a.naam.localeCompare(b.naam)); // ✅ Alfabetisch sorteren

            data.forEach(recipe => {
                const recipeTile = document.createElement("div");
                recipeTile.classList.add("recipe-tile");
                recipeTile.innerHTML = `
                    <a href="recept.html?id=${recipe.id}">
                        <img class="recipe-img" src="${recipe.afbeelding}" alt="${recipe.naam}">
                        <h3>${recipe.naam}</h3>
                    </a>
                `;
                recipeGrid.appendChild(recipeTile);
            });

            console.log("Recepten alfabetisch gesorteerd en geladen!");
        })
        .catch(error => {
            console.error("Fout bij laden recepten:", error);
        });
}

function loadRecipeDetails(recipeId) {
    fetch("https://edro01.github.io/recepten-website/recepten.json")
        .then(response => response.json())
        .then(data => {
            console.log("Ontvangen data:", data);

            if (!Array.isArray(data.recepten)) {
                console.error("Data.recepten is geen array! Kan recept niet laden.");
                return;
            }

            const recipe = data.recepten.find(r => r.id === recipeId);

            if (!recipe) {
                document.getElementById("recipe-title").textContent = "Recept niet gevonden!";
                return;
            }

            document.getElementById("recipe-title").textContent = recipe.naam;
            document.getElementById("recipe-image").src = recipe.afbeelding;
            document.getElementById("recipe-image").alt = recipe.naam;

            const ingredientsList = document.getElementById("ingredients-list");
            const instructionsList = document.getElementById("instructions-list");
            const caloriesDisplay = document.getElementById("calories");

            ingredientsList.innerHTML = "";
            instructionsList.innerHTML = "";
            caloriesDisplay.textContent = `Calorieën: ${recipe.calorieën}`;

            recipe.ingrediënten.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item;
                ingredientsList.appendChild(li);
            });

            recipe.bereiding.forEach(step => {
                let li = document.createElement("li");
                li.textContent = step;
                instructionsList.appendChild(li);
                instructionsList.appendChild(document.createElement("br")); // Extra witregel
            });

            setupPortionAdjustment(recipe);
        })
        .catch(error => console.error("Fout bij laden recepten:", error));
}

function setupPortionAdjustment(recipe) {
    const portionInput = document.getElementById("portion-size");
    const updateButton = document.getElementById("update-portion");

    if (!portionInput || !updateButton) {
        console.error("Portie-aanpassings elementen niet gevonden!");
        return;
    }

    updateButton.addEventListener("click", () => {
        const portionSize = parseFloat(portionInput.value);

        const ingredientsList = document.getElementById("ingredients-list");
        const caloriesDisplay = document.getElementById("calories");

        ingredientsList.innerHTML = "";

        recipe.ingrediënten.forEach(item => {
            let updatedItem = item.replace(/(\d+(\.\d+)?)/g, match => {
                let newAmount = parseFloat(match) * portionSize;
                let roundedAmount = (Math.round(newAmount * 10) / 10); 
                return roundedAmount % 1 === 0 ? roundedAmount.toFixed(0) : roundedAmount.toFixed(1);
            });

            let li = document.createElement("li");
            li.textContent = updatedItem;
            ingredientsList.appendChild(li);
        });

        let newCalories = Math.round(recipe.calorieën * portionSize);
        caloriesDisplay.textContent = `Calorieën: ${newCalories}`;

        console.log(`Portiegrootte aangepast: x${portionSize}, nieuwe calorieën: ${newCalories}`);
    });
}
