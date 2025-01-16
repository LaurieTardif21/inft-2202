import { getAnimals, deleteAnimal } from "./animals/animal.service.js";

// Function to draw the table with animals
function drawAnimalsTable(animals) {
    console.log('Animals to display:', animals); // Debugging log to check the data

    const messageBox = document.getElementById('message-box');
    const table = document.getElementById('animals-list');
    const tbody = table.querySelector('tbody');

    // Clear the table body before adding new rows
    tbody.innerHTML = '';

    if (animals.length === 0) {
        messageBox.classList.remove('d-none'); // Show message box if no animals
        table.classList.add('d-none'); // Hide the table
    } else {
        messageBox.classList.add('d-none'); // Hide message box if animals are present
        table.classList.remove('d-none'); // Show the table

        // Insert rows for each animal
        animals.forEach(animal => {
            const row = tbody.insertRow();

            // Insert animal data into cells
            row.insertCell().textContent = animal.name;
            row.insertCell().textContent = animal.breed;
            row.insertCell().textContent = animal.eyes;
            row.insertCell().textContent = animal.legs;
            row.insertCell().textContent = animal.sound;

            // Insert the Actions cell with Edit and Delete buttons
            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-warning', 'btn-sm');
            editButton.onclick = () => editAnimal(animal.id); // Define edit functionality

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteButton.onclick = () => deleteAnimalHandler(animal.id); // Define delete functionality

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }
}

// Function to handle the delete button click
function deleteAnimalHandler(animalId) {
    deleteAnimal(animalId).then(() => {
        // Reload the list after deletion
        loadAnimals();
    }).catch(error => {
        console.error('Error deleting animal:', error);
    });
}

// Function to load animals and populate the table
function loadAnimals() {
    getAnimals().then(animals => {
        console.log('Loaded animals:', animals); // Check if the animals data is correct
        drawAnimalsTable(animals);
    }).catch(error => {
        console.error('Error loading animals:', error); // Handle any errors while loading
    });
}

// Initial load of animals when the page loads
document.addEventListener('DOMContentLoaded', loadAnimals);