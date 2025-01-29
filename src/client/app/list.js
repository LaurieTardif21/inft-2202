import { getAnimals, deleteAnimal } from "./animals/animal.service.js";

// Fetches and displays animal data in a table
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
            console.log('Animal:', animal); // Log each animal to check the id

            if (!animal.id) {
                console.error('Missing ID for animal:', animal); // Log any animal missing an ID
            }

            const row = tbody.insertRow();

            // Insert animal data into cells
            row.insertCell().textContent = animal.name;
            row.insertCell().textContent = animal.breed;
            row.insertCell().textContent = animal.eyes;
            row.insertCell().textContent = animal.legs;
            row.insertCell().textContent = animal.sound;

            // Insert the Actions cells with Edit and Delete buttons
            const editCell = row.insertCell();
            const deleteCell = row.insertCell();

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-warning', 'btn-sm');
            editButton.onclick = () => {
                if (animal.id) {
                    editAnimal(animal.id); // Proceed if ID is defined
                } else {
                    console.error('Animal ID is undefined.');
                }
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteButton.onclick = () => {
                if (animal.id) {
                    deleteAnimalHandler(animal.id); // Proceed if ID is defined
                } else {
                    console.error('Animal ID is undefined.');
                }
            };

            editCell.appendChild(editButton);  // Add the Edit button to the first cell
            deleteCell.appendChild(deleteButton);  // Add the Delete button to the second cell
        });
    }
}

// Function to handle the deletion of an animal
function deleteAnimalHandler(animalId) {
    console.log('Deleting animal with ID:', animalId);
    // Perform the delete operation (e.g., send to server or remove from data)
    // You can add actual logic here for removing the animal from the data source.
}

// Function to handle the editing of an animal
function editAnimal(animalId) {
    console.log('Editing animal with ID:', animalId);
    // Implement the edit functionality (e.g., populate a form with the animal's data)
}