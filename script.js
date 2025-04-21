<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recept</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js" defer></script>
</head>
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (!recipeId) {
        document.getElementById("recipe-title").textContent = "Recept niet gevonden!";
        return;
    }

    fetch("recepten.json")
        .then(response => response.json())
        .then(data => {
            const recipe = data.find(r => r.id === recipeId);

            if (!recipe) {
                document.getElementById("recipe-title").textContent = "Recept niet gevonden!";
                return;
            }

            document.getElementById("recipe-title").textContent = recipe.naam;
            document.getElementById("recipe-category").textContent = recipe.categorie;
            document.getElementById("recipe-image").src = recipe.afbeelding;
            document.getElementById("recipe-image").alt = recipe.naam;
            document.getElementById("calories").textContent = recipe.voedingswaarden.calorieën;
            document.getElementById("fat").textContent = recipe.voedingswaarden.vet;

            const ingredientsList = document.getElementById("ingredients-list");
            recipe.ingrediënten.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item;
                ingredientsList.appendChild(li);
            });

            const instructionsList = document.getElementById("instructions-list");
            recipe.bereiding.forEach(step => {
                let li = document.createElement("li");
                li.textContent = step;
                instructionsList.appendChild(li);
            });
        })
        .catch(error => console.error("Fout bij laden recepten:", error));
});
