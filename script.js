document.addEventListener("DOMContentLoaded", () => {
    console.log("Script is geladen!"); // Debug log 1

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");
    console.log("Recipe ID opgehaald:", recipeId); // Debug log 2

    if (!recipeId) {
        console.error("Geen recept-ID gevonden!");
        document.getElementById("recipe-title").textContent = "Recept niet gevonden!";
        return;
    }

    fetch("https://edro01.github.io/recepten-website/recepten.json")
        .then(response => {
            console.log("Fetching recepten.json..."); // Debug log 3
            if (!response.ok) {
                throw new Error(`Fout bij laden recepten.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data ontvangen:", data); // Debug log 4

            if (!Array.isArray(data)) {
                throw new Error("Ongeldig receptformaat!");
            }

            const recipe = data.find(r => r.id === recipeId);
            console.log("Gevonden recept:", recipe); // Debug log 5

            if (!recipe) {
                document.getElementById("recipe-title").textContent = "Recept niet gevonden!";
                return;
            }

            document.getElementById("recipe-title").textContent = recipe.naam;
            document.getElementById("recipe-image").src = recipe.afbeelding;
            document.getElementById("recipe-image").alt = recipe.naam;

            const ingredientsList = document.getElementById("ingredients-list");
            const instructionsList = document.getElementById("instructions-list");

            if (!ingredientsList || !instructionsList) {
                console.error("Ingrediënten- of bereidingslijst niet gevonden!");
                return;
            }

            ingredientsList.innerHTML = "";
            instructionsList.innerHTML = "";

            recipe.ingrediënten.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item;
                ingredientsList.appendChild(li);
            });

            recipe.bereiding.forEach(step => {
                let li = document.createElement("li");
                li.textContent = step;
                instructionsList.appendChild(li);
            });

            console.log("Recept succesvol weergegeven!"); // Debug log 6
        })
        .catch(error => {
            console.error("Fout bij laden recepten:", error);
            document.getElementById("recipe-title").textContent = "Recept kon niet worden geladen!";
        });
});
