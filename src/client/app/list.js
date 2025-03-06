import { getAnimalPage, deleteAnimal, getAnimals } from './animals/animal.service.js';

// Selectors for DOM elements
const tableBody = document.querySelector('#animal-table tbody');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const currentPageSpan = document.getElementById('current-page');
const noServiceMessage = document.getElementById('no-service-message');
const noAnimalMessage = document.getElementById('no-animals-message');
const loadingMessage = document.getElementById('loading-message');

// Global variables
let animalIdToDelete = null;
let currentPage = 1;
let perPage = 5;
let animalsArray = [];

// Function to manage the loading message
function manageLoadingMessage(isLoading) {
    console.log("manageLoadingMessage:", isLoading); // Check if the function is called and what value
    if (isLoading) {
        loadingMessage.classList.remove('d-none');
    } else {
        loadingMessage.classList.add('d-none');
    }
}

// Function to manage the "no service" message
function manageNoServiceMessage(show) {
    if (show) {
        noServiceMessage.classList.remove('d-none');
    } else {
        noServiceMessage.classList.add('d-none');
    }
}

//Function to manage the no animal message
function checkIfListIsEmpty(show) {
    console.log("checkIfListIsEmpty:", show); // Check if the function is called and what value
    if (show) {
        noAnimalMessage.classList.remove('d-none');
    } else {
        noAnimalMessage.classList.add('d-none');
    }
}

// Function to manage pagination
function managePagination() {
    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= animalsArray.pagination.pages;
    currentPageSpan.textContent = currentPage;
}

// Function to get animals with delay
async function getAnimalsWithDelay(page, perPage) {
    try {
        const response = await getAnimalPage(page, perPage);
        return response;
    } catch (error) {
        console.error('Error in getAnimalsWithDelay:', error);
        return null;
    }
}

// Function to populate the animal table
async function populateAnimalTable(animals) {
    if (!animals || !animals.records) {
        //do something
        return;
    }
    if (!Array.isArray(animals.records)) {
        console.error("records is not an array")
        return;
    }
    //remove all the data in the table
    const tableBody = document.querySelector('#animal-table tbody');
    tableBody.innerHTML = '';
    //if the array is empty. the for each will not execute
    animals.records.forEach((animal) => {
        // ... other code to create the row
        const row = document.createElement('tr');
        row.id = `animal-${animal.name}`; // Assign an ID to the row for easy removal later

        const nameCell = document.createElement('td');
        nameCell.textContent = animal.name; // Accessing the 'name' property
        row.appendChild(nameCell);

        const breedCell = document.createElement('td');
        breedCell.textContent = animal.breed; // Accessing the 'breed' property
        row.appendChild(breedCell);

        const eyesCell = document.createElement('td');
        eyesCell.textContent = animal.eyes; // Accessing the 'eyes' property
        row.appendChild(eyesCell);

        const legsCell = document.createElement('td');
        legsCell.textContent = animal.legs; // Accessing the 'legs' property
        row.appendChild(legsCell);

        const soundCell = document.createElement('td');
        soundCell.textContent = animal.sound; // Accessing the 'sound' property
        row.appendChild(soundCell);

        const actionsCell = document.createElement('td');
        const editButton = createEditButton(animal); // Pass the animal ID to the edit button
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal); // Pass the animal ID to the delete button
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

}

// Function to create the edit button
function createEditButton(animal) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('btn', 'btn-primary', 'me-2');
    editButton.setAttribute('data-bs-toggle', 'tooltip');
    editButton.setAttribute('data-bs-placement', 'top');
    editButton.setAttribute('title', 'Edit');
    editButton.addEventListener('click', () => {
        // Here, you can call a function to handle the edit logic
        alert(`Editing animal: ${animal.name}`);
    });
    return editButton;
}

// Function to create the delete button
function createDeleteButton(animal) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.setAttribute('data-bs-toggle', 'tooltip');
    deleteButton.setAttribute('data-bs-placement', 'top');
    deleteButton.setAttribute('title', 'Delete');
    deleteButton.addEventListener('click', () => {
        // Set the animalIdToDelete for confirmation
        animalIdToDelete = animal.name;
        const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.show();
    });
    return deleteButton;
}
// Event listener for delete confirmation
document.getElementById('confirmDelete').addEventListener('click', async () => {
    if (animalIdToDelete) {
        manageLoadingMessage(true);
        await deleteAnimal(animalIdToDelete);
        manageLoadingMessage(false);
        const rowToDelete = document.getElementById(`animal-${animalIdToDelete}`);
        if (rowToDelete) {
            rowToDelete.remove();
        }
        // Reset the animalIdToDelete
        animalIdToDelete = null;
        const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.hide();
    }
});
// Function to initialize the page
async function initializePage() {
    checkIfListIsEmpty(true);
    // show loading message
    manageLoadingMessage(true);
    try {
        // First, get the total count
        const response = await getAnimals();
        //check if the reponse is define
        if (!response) {
            manageNoServiceMessage(true);
            manageLoadingMessage(false);
            return;
        }

        animalsArray = response;
        perPage = response.pagination.perPage;
        currentPage = response.pagination.page;

        console.log("animalsArray");
        console.log(animalsArray);
        managePagination();
        populateAnimalTable(animalsArray);
        //check if there is animal in the table
        if (animalsArray.records.length == 0) {
            checkIfListIsEmpty(true);
        }
        else {
            checkIfListIsEmpty(false);
        }
    } catch (error) {
        const errorMessagebox = document.getElementById('error-message-box');
        errorMessagebox.classList.remove('d-none');
        console.error('Error fetching animals:', error);
    } finally {
        //hide loading message
        manageLoadingMessage(false);
    }
}
// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    // Function to handle previous button click
    previousButton.addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await initializePage(); // Re-initialize the page with the new data
        }
    });

    // Function to handle next button click
    nextButton.addEventListener('click', async () => {
        if (currentPage < animalsArray.pagination.pages) {
            currentPage++;
            await initializePage(); // Re-initialize the page with the new data
        }
    });
});