document.addEventListener("DOMContentLoaded", () => {
    const recipeGrid = document.getElementById("recipe-grid");

    if (!recipeGrid) {
        console.error("Element 'recipe-grid' niet gevonden!");
        return;
    }

    fetch("https://edro01.github.io/recepten-website/recepten.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Fout bij laden recepten.json");
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                console.error("Geen recepten gevonden!");
                recipeGrid.innerHTML = "<p>Geen recepten beschikbaar.</p>";
                return;
            }

            recipeGrid.innerHTML = ""; // Zorg dat oude content wordt leeggemaakt

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
        .catch(error => {
            console.error("Fout bij laden recepten:", error);
            recipeGrid.innerHTML = "<p>Kan recepten niet laden. Probeer later opnieuw.</p>";
        });
});
