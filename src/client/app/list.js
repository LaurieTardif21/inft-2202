import { getAnimals, deleteAnimal, updateAnimal } from './animals/animal.service.js';

// Helper function to create input fields
function createInput(value, name, type = 'text') {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.value = value;
    input.classList.add('form-control', 'form-control-sm');
    return input;
}

// Function to convert row to edit mode
function convertToEditMode(row, animal) {
    // Replace each cell with an input field
    const nameCell = row.children[0];
    nameCell.innerHTML = ''; // Clear existing content
    nameCell.appendChild(createInput(animal.name, 'name'));

    const breedCell = row.children[1];
    breedCell.innerHTML = ''; // Clear existing content
    breedCell.appendChild(createInput(animal.breed, 'breed'));

    const eyesCell = row.children[2];
    eyesCell.innerHTML = ''; // Clear existing content
    eyesCell.appendChild(createInput(animal.eyes, 'eyes', 'number'));

    const legsCell = row.children[3];
    legsCell.innerHTML = ''; // Clear existing content
    legsCell.appendChild(createInput(animal.legs, 'legs', 'number'));

    const soundCell = row.children[4];
    soundCell.innerHTML = ''; // Clear existing content
    soundCell.appendChild(createInput(animal.sound, 'sound'));

    // Remove the actions cell and add save and cancel button
    const actionCell = row.children[5];
    actionCell.innerHTML = '';

    // Create save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('btn', 'btn-success', 'btn-sm', 'me-2');
    saveButton.addEventListener('click', () => {
        // Create the updatedAnimal object
        const updatedAnimal = {
            id: animal.id,
            name: row.querySelector('[name="name"]').value,
            breed: row.querySelector('[name="breed"]').value,
            eyes: row.querySelector('[name="eyes"]').value,
            legs: row.querySelector('[name="legs"]').value,
            sound: row.querySelector('[name="sound"]').value,
        };

        updateAnimal(updatedAnimal)
            .then(() => {
                console.log('Animal updated successfully');
                convertToViewMode(row, updatedAnimal);
            })
            .catch((error) => {
                console.error('Error updating animal:', error);
            });
    });
    actionCell.appendChild(saveButton);

    // Create cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('btn', 'btn-secondary', 'btn-sm');
    cancelButton.addEventListener('click', () => {
        convertToViewMode(row, animal);
    });
    actionCell.appendChild(cancelButton);
}

// Function to convert row back to view mode
function convertToViewMode(row, animal) {
    // Replace input fields with text content
    row.children[0].textContent = animal.name;
    row.children[1].textContent = animal.breed;
    row.children[2].textContent = animal.eyes;
    row.children[3].textContent = animal.legs;
    row.children[4].textContent = animal.sound;

    // Remove all children from the action cell
    const actionCell = row.children[5];
    actionCell.innerHTML = '';

    // Add edit and delete buttons
    const editButton = createEditButton(animal.id);
    actionCell.appendChild(editButton);

    const deleteButton = createDeleteButton(animal.id);
    actionCell.appendChild(deleteButton);
}

function createEditButton(animalId) {
    const button = document.createElement('button');
    button.textContent = 'Edit';
    button.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
    button.addEventListener('click', (event) => {
        const row = event.target.closest('tr'); // Get the row element
        const animal = {
            id: animalId,
            name: row.children[0].textContent,
            breed: row.children[1].textContent,
            eyes: row.children[2].textContent,
            legs: row.children[3].textContent,
            sound: row.children[4].textContent,
        };

        convertToEditMode(row, animal);
    });
    return button;
}

function createDeleteButton(animalId) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.classList.add('btn', 'btn-danger', 'btn-sm');
    button.addEventListener('click', () => {
        deleteAnimal(animalId)
            .then(() => {
                // Remove the row from the table
                const row = document.getElementById(`animal-${animalId}`);
                row.remove();
                // Update the empty list message if needed
                checkIfListIsEmpty();
            })
            .catch((error) => {
                console.error('Error deleting animal:', error);
            });
    });
    return button;
}

function populateAnimalTable(animals) {
    console.log('Animals from getAnimals:', animals); // Check the animals array

    const tableBody = document.querySelector('#animals-list tbody');
    tableBody.innerHTML = '';

    animals.forEach((animal) => {
        // ... other code to create the row
        const row = document.createElement('tr');
        row.id = `animal-${animal.id}`; // Assign an ID to the row for easy removal later

        const nameCell = document.createElement('td');
        nameCell.textContent = animal.name; // Accessing the 'animalName' property
        row.appendChild(nameCell);

        const breedCell = document.createElement('td');
        breedCell.textContent = animal.breed; // Accessing the 'animalBreed' property
        row.appendChild(breedCell);

        const eyesCell = document.createElement('td');
        eyesCell.textContent = animal.eyes; // Accessing the 'animalEyes' property
        row.appendChild(eyesCell);

        const legsCell = document.createElement('td');
        legsCell.textContent = animal.legs; // Accessing the 'animalLegs' property
        row.appendChild(legsCell);

        const soundCell = document.createElement('td');
        soundCell.textContent = animal.sound; // Accessing the 'animalSound' property
        row.appendChild(soundCell);

        const actionsCell = document.createElement('td');
        const editButton = createEditButton(animal.id); // Pass the animal ID to the edit button
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal.id); // Pass the animal ID to the delete button
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
        // ... add the button to the row
    });
    checkIfListIsEmpty();

}

function checkIfListIsEmpty() {
    const tableBody = document.querySelector('#animals-list tbody');
    const messageBox = document.getElementById('message-box');
    const animalListTable = document.getElementById('animals-list');

    if (tableBody.children.length === 0) {
        animalListTable.classList.add('d-none');
        messageBox.classList.remove('d-none');
    } else {
        animalListTable.classList.remove('d-none');
        messageBox.classList.add('d-none');
    }
}

function initializePage() {
    getAnimals()
        .then(animals => {
            populateAnimalTable(animals);
        })
        .catch(error => {
            console.error('Error fetching animals:', error);
        });
}

// Call initializePage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);