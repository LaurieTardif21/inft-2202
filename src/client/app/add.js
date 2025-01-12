/*
    Name: Laurie Tardif
    filename: add.js
    Course: INFT 2202
    Date: January 10, 2025
    Description: Script for adding items and validating the form.
*/

// Validate the form
function validateAnimalForm(form) {
    let isValid = true;

    // Validate item name
    const itemName = form.itemName.value.trim();
    const itemNameError = form.itemName.nextElementSibling;

    if (itemName === "") {
        itemNameError.textContent = "Item name is required.";
        itemNameError.classList.remove("d-none");
        isValid = false;
    } else {
        itemNameError.classList.add("d-none");
    }

    return isValid;
}

// Add the animal to local storage
function putAnimalInStorage(animal) {
    let animals = JSON.parse(localStorage.getItem("animals")) || [];

    // Check if the animal already exists
    if (animals.some(existingAnimal => existingAnimal.name === animal.name)) {
        throw new Error("That animal already exists!");
    }

    // Add the animal and save it to local storage
    animals.push(animal);
    localStorage.setItem("animals", JSON.stringify(animals));
}

// Handle form submission
function submitAnimalForm(event) {
    event.preventDefault();

    const form = event.target;

    if (validateAnimalForm(form)) {
        const animal = {
            name: form.itemName.value.trim(),
        };

        try {
            putAnimalInStorage(animal);
            // Redirect to the list page
            window.location.href = "list.html";
        } catch (error) {
            const itemNameError = form.itemName.nextElementSibling;
            itemNameError.textContent = error.message;
            itemNameError.classList.remove("d-none");
        }
    }
}

// Attach the event listener to the form
document.getElementById("animalForm").addEventListener("submit", submitAnimalForm);