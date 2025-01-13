/*
    Name: Laurie Tardif
    Filename: list.js
    Course: INFT 2202
    Date: January 10, 2025
    Description: This is the general application script. Functions that are required on the add page live here.
*/

// Importing the animals services module
import { getAnimals } from './animals.services.js';

// Function to draw the animals table
function drawAnimalsTable(animals) {
    const messageBox = document.getElementById('message-box');
    const animalsTable = document.getElementById('animals-list');
    const tbody = animalsTable.querySelector('tbody');

    // Clear any previous rows in the table
    tbody.innerHTML = '';

    // Check if there are any animals in the list
    if (animals.length > 0) {
        // Hide the message box and show the table
        messageBox.classList.add('d-none');
        animalsTable.classList.remove('d-none');

        // Loop through each animal and add a row to the table
        animals.forEach(animal => {
            const row = tbody.insertRow();

            // Insert cells for each animal property
            row.insertCell().textContent = animal.name;
            row.insertCell().textContent = animal.breed;
            row.insertCell().textContent = animal.eyes;
            row.insertCell().textContent = animal.legs;
            row.insertCell().textContent = animal.sound;

            // Insert an empty cell for the edit/delete buttons
            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2');
            editButton.textContent = 'Edit';
            // Add event listener for edit button (you can implement the edit functionality later)
            editButton.addEventListener('click', () => editAnimal(animal.id));

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteButton.textContent = 'Delete';
            // Add event listener for delete button
            deleteButton.addEventListener('click', () => deleteAnimal(animal.id));

            // Append the buttons to the actions cell
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    } else {
        // If there are no animals, hide the table and show the message box
        animalsTable.classList.add('d-none');
        messageBox.classList.remove('d-none');
    }
}

// Fetch the list of animals when the page loads and call drawAnimalsTable
window.addEventListener('DOMContentLoaded', () => {
    getAnimals().then(animals => {
        drawAnimalsTable(animals);
    });
});

// Placeholder for the edit and delete functionality (you can implement these as needed)
function editAnimal(animalId) {
    console.log('Edit animal with ID:', animalId);
}

function deleteAnimal(animalId) {
    console.log('Delete animal with ID:', animalId);
}