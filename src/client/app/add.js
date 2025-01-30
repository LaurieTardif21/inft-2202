import { addAnimal, getAnimals, deleteAnimal } from "/inft-2202/src/client/app/animals/animal.service.js";
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

    // Define the maximum limits
    const maxEyes = 10;
    const maxLegs = 8;

    // List of fields to validate
    const fields = [
        { name: 'animalName', message: 'Animal name is required.' },
        { name: 'animalBreed', message: 'Breed is required.' },
        { name: 'animalEyes', message: `Number of eyes is required, must be a positive number and less than or equal to ${maxEyes}.`, isNumber: true, max: maxEyes },
        { name: 'animalLegs', message: `Number of legs is required, must be a positive number and less than or equal to ${maxLegs}.`, isNumber: true, max: maxLegs },
        { name: 'animalSound', message: 'Sound is required.' },
    ];

    // Validate each field
    fields.forEach(field => {
        const input = form[field.name];
        const value = input.value.trim();
        const errorField = input.nextElementSibling;

        if (field.isNumber) {
            const numberValue = Number(value);
            if (!value || isNaN(numberValue) || numberValue < 0 || numberValue > field.max) {
                errorField.textContent = field.message;
                errorField.classList.remove('d-none');
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                errorField.textContent = '';
                errorField.classList.add('d-none');
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        } else {
            if (!value) {
                errorField.textContent = field.message;
                errorField.classList.remove('d-none');
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                errorField.textContent = '';
                errorField.classList.add('d-none');
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        }
    });

    return isValid;
}

// Add the animal to local storage
function putAnimalInStorage(animal) {
    let animals = JSON.parse(localStorage.getItem('animals')) || [];
    
    // Create a unique id for the animal if it doesn't already exist
    const id = Date.now(); // Using timestamp as a unique id
    animal.id = id;

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
    event.preventDefault(); // Prevent the form from submitting the default way.

    const form = event.target;

    // Validate the form
    if (validateAnimalForm(form)) {
        const animal = {
            name: form.animalName.value.trim(),
            breed: form.animalBreed.value.trim(),
            eyes: Number(form.animalEyes.value.trim()),
            legs: Number(form.animalLegs.value.trim()),
            sound: form.animalSound.value.trim(),
        };

        try {
            // Attempt to add the animal to local storage
            putAnimalInStorage(animal);

            // If successful, redirect to list.html
            window.location.href = './list.html';
        } catch (error) {
            // Display the error message in the name's error field
            const errorField = form.animalName.nextElementSibling;
            errorField.textContent = error.message;
            errorField.classList.remove('d-none');
        }
    }
}

// Handle animal deletion
function handleDelete(animalId) {
    deleteAnimal(animalId)
        .then(() => {
            console.log('Animal deleted successfully');
            // Refresh the list
            loadAnimals();
        })
        .catch(error => {
            console.error('Error deleting animal:', error);
        });
}

// Load animals from localStorage
// Load animals from localStorage
function loadAnimals() {
    const animals = JSON.parse(localStorage.getItem('animals')) || [];
    const listContainer = document.getElementById('animalList'); // Assuming you have a container for the list
    
    // Ensure the listContainer is not null before accessing its properties
    if (!listContainer) {
        console.error('Animal list container not found!');
        return;
    }

    // Clear the list before repopulating
    listContainer.innerHTML = '';

    animals.forEach(animal => {
        const listItem = document.createElement('li');
        listItem.textContent = `${animal.name} - ${animal.breed}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        
        // Pass animal.id to the delete handler
        deleteButton.onclick = function() {
            handleDelete(animal.id);
        };
        
        listItem.appendChild(deleteButton);
        listContainer.appendChild(listItem);
    });
}

// Ensure the DOM is fully loaded before running the code
document.addEventListener('DOMContentLoaded', () => {
    loadAnimals(); // Call this after the page is fully loaded
});

// Clear error message when the user starts typing a new name
document.getElementById('animalName').addEventListener('input', () => {
    const errorField = document.getElementById('animalName').nextElementSibling;
    if (errorField) {
        errorField.textContent = '';
        errorField.classList.add('d-none');
    }
});

// Attach the event listener to the form
document.getElementById('animalForm').addEventListener('submit', submitAnimalForm);

// Call loadAnimals to display the list on page load
loadAnimals();