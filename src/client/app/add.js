/*
    Name: Laurie Tardif
    Filename: add.js
    Course: INFT 2202
    Date: January 10, 2025
    Description: This is the general application script. Functions that are required on the add page live here.
*/

// Validate the animal form
function validateAnimalForm(form) {
    let isValid = true;

    // Check the animalName field
    const animalName = form.animalName.value.trim();
    const errorField = form.animalName.nextElementSibling;

    if (animalName === '') {
        errorField.textContent = 'Animal name is required.';
        errorField.classList.remove('d-none');
        isValid = false;
    } else {
        errorField.textContent = '';
        errorField.classList.add('d-none');
    }

    return isValid;
}

// Add the animal to local storage
function putAnimalInStorage(animal) {
    let animals = JSON.parse(localStorage.getItem('animals')) || [];

    // Check if the animal already exists
    if (animals.some(existingAnimal => existingAnimal.name.toLowerCase() === animal.name.toLowerCase())) {
        throw new Error('That animal already exists!');
    }

    // Add the new animal and update local storage
    animals.push(animal);
    localStorage.setItem('animals', JSON.stringify(animals));
}

// Handle form submission
function submitAnimalForm(event) {
    event.preventDefault();

    const form = event.target;

    // Validate the form
    if (validateAnimalForm(form)) {
        const animal = {
            name: form.animalName.value.trim()
        };

        try {
            // Attempt to add the animal to storage
            putAnimalInStorage(animal);

            // Redirect to list.html on success
            window.location.href = 'list.html';
        } catch (error) {
            // Display the error message in the name's error field
            const errorField = form.animalName.nextElementSibling;
            errorField.textContent = error.message;
            errorField.classList.remove('d-none');
        }
    }
}

// Attach the event listener to the form
document.getElementById('animalForm').addEventListener('submit', submitAnimalForm);