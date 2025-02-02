import { getAnimals, deleteAnimal } from './animals/animal.service.js';

// Global variable to store the animalId to delete
let animalIdToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
const perPage = 5;
// Global varible for the array of animals
let animalsArray = [];

function createEditButton(animalId) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
    button.setAttribute('data-bs-toggle', 'tooltip'); // Enable tooltip
    button.setAttribute('data-bs-placement', 'top'); // Set tooltip placement
    button.setAttribute('title', 'Edit Animal'); // Set tooltip text
    // Add icon
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-pen-to-square'); // Edit icon
    button.appendChild(icon);
    button.addEventListener('click', () => {
        // Redirect to animal.html with the animalId as a query parameter
        window.location.href = `animal.html?id=${animalId}`;
    });
    return button;
}

function createDeleteButton(animalId) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-danger', 'btn-sm');
    button.setAttribute('data-bs-toggle', 'tooltip'); // Enable tooltip
    button.setAttribute('data-bs-placement', 'top'); // Set tooltip placement
    button.setAttribute('title', 'Delete Animal'); // Set tooltip text
    // Add icon
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash-alt'); // Delete icon
    button.appendChild(icon);
    button.addEventListener('click', () => {
        // Set the animal ID to delete in the global variable
        animalIdToDelete = animalId;
        // Show the confirmation modal
        const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.show();
    });
    return button;
}

function populateAnimalTable(animals) {
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
    // Initialize Bootstrap tooltips after the table is populated
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
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
// Function to create and manage the pagination
function managePagination() {
    // Get the container and the ul
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationUl = document.getElementById('pagination');
    //get the previous and next li
    const previousPageLi = document.getElementById('previousPage');
    const nextPageLi = document.getElementById('nextPage');
    // Remove previous page link
    paginationUl.querySelectorAll('.page-number').forEach(li => li.remove());

    //check if there is more than 5 animals
    if (animalsArray.length > perPage) {
        paginationContainer.classList.remove('d-none');
    } else {
        paginationContainer.classList.add('d-none');
        return;
    }
    // Calculate the number of pages
    const numberOfPages = Math.ceil(animalsArray.length / perPage);

    // Create the page number
    for (let i = 1; i <= numberOfPages; i++) {
        //create the li
        const pageNumberLi = document.createElement('li');
        pageNumberLi.classList.add('page-item', 'page-number');
        if (i === currentPage) {
            pageNumberLi.classList.add('active');
        }
        //create the link
        const pageNumberLink = document.createElement('a');
        pageNumberLink.classList.add('page-link');
        pageNumberLink.href = '#';
        pageNumberLink.textContent = i;

        //manage the click event
        pageNumberLink.addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = i;
            managePagination(); // Update the pagination
            populateAnimalTable(getCurrentPageAnimals());
        });

        //append the elements
        pageNumberLi.appendChild(pageNumberLink);
        paginationUl.insertBefore(pageNumberLi, nextPageLi);
    }

    //Manage the previous button
    previousPageLi.classList.toggle('disabled', currentPage === 1);
    //add the event if is not disabled
    if (currentPage !== 1) {
        previousPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            currentPage--;
            managePagination();
            populateAnimalTable(getCurrentPageAnimals());
        }, { once: true });
    }

    //Manage the next button
    nextPageLi.classList.toggle('disabled', currentPage === numberOfPages);
    //add the event if is not disabled
    if (currentPage !== numberOfPages) {
        nextPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            currentPage++;
            managePagination();
            populateAnimalTable(getCurrentPageAnimals());
        }, { once: true });
    }
}

function initializePage() {
    getAnimals()
        .then(animals => {
            animalsArray = animals;
            managePagination();
            populateAnimalTable(getCurrentPageAnimals());
        })
        .catch(error => {
            console.error('Error fetching animals:', error);
        });
}
// Function to get the animals for the current page
function getCurrentPageAnimals() {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return animalsArray.slice(startIndex, endIndex);
}
// Attach the event listener to the confirmDeleteButton when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.addEventListener('click', () => {
        // Check if the animalIdToDelete is defined
        if (animalIdToDelete !== null) {
            // Perform the deletion using the animalIdToDelete
            deleteAnimal(animalIdToDelete)
                .then(() => {
                    // Remove the animal in the global array
                    const index = animalsArray.findIndex(animal => animal.id === animalIdToDelete);
                    if (index !== -1) {
                        animalsArray.splice(index, 1);
                    }
                    // Remove the row from the table
                    const row = document.getElementById(`animal-${animalIdToDelete}`);
                    row.remove();
                    // Update the empty list message if needed
                    checkIfListIsEmpty();
                    // Update the pagination
                    managePagination();
                    // Update the table
                    populateAnimalTable(getCurrentPageAnimals());
                    // Close the modal
                    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                    deleteConfirmationModal.hide();
                    // Reset the animalIdToDelete
                    animalIdToDelete = null;
                })
                .catch((error) => {
                    console.error('Error deleting animal:', error);
                });
        }
    });
    initializePage();
});