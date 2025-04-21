document.addEventListener("DOMContentLoaded", () => {
    const recipeGrid = document.getElementById("recipe-grid");
    if (!recipeGrid) {
        console.error("Element 'recipe-grid' niet gevonden!");
        return;
    }

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
});
