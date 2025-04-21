document.addEventListener("DOMContentLoaded", () => {
    fetch("recepten.json")
        .then(response => response.json())
        .then(data => {
            const recipeGrid = document.getElementById("recipe-grid");
            if (!recipeGrid) return;

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
