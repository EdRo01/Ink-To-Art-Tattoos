document.addEventListener("DOMContentLoaded", function () {
    const updateButton = document.getElementById("update-portion");

    if (updateButton) { // Controleer of het element bestaat
        updateButton.addEventListener("click", function () {
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

                        const calorieElement = document.getElementById("calories");
                        calorieElement.textContent = `Calorieën: ${recipe.calorieën * portionSize}`;
                    }
                }).catch(error => console.error("Fout bij portieberekening:", error));
        });
    } else {
        console.error("Element #update-portion niet gevonden!");
    }
});
