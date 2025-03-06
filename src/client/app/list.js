import { getAnimalPage, deleteAnimal, getAnimals } from './animals/animal.service.js';
// Global variables
let animalIdToDelete = null;
let currentPage = 1;
let perPage = 5;
let animalsArray = [];

// Function to manage the loading message
function manageLoadingMessage(loadingMessage, isLoading) {
    console.log("manageLoadingMessage:", isLoading); // Check if the function is called and what value
    if (!loadingMessage) {
        console.error("loadingMessage is null");
        return;
    }
    if (isLoading) {
        loadingMessage.classList.remove('d-none');
    } else {
        loadingMessage.classList.add('d-none');
    }
}

// Function to manage the "no service" message
function manageNoServiceMessage(noServiceMessage, show) {
    if (!noServiceMessage) {
        console.error("noServiceMessage is null");
        return;
    }
    if (show) {
        noServiceMessage.classList.remove('d-none');
    } else {
        noServiceMessage.classList.add('d-none');
    }
}

//Function to manage the no animal message
function checkIfListIsEmpty(noAnimalMessage, show) {
    console.log("checkIfListIsEmpty:", show); // Check if the function is called and what value
    if (!noAnimalMessage) {
        console.error("noAnimalMessage is null");
        return;
    }
    if (show) {
        noAnimalMessage.classList.remove('d-none');
    } else {
        noAnimalMessage.classList.add('d-none');
    }
}

// Function to manage pagination
function managePagination(previousPage, nextPage, currentPageSpan) {
    if(!previousPage || !nextPage || !currentPageSpan){
        console.error("variable is null");
        return;
    }
    previousPage.classList.remove('disabled');
    nextPage.classList.remove('disabled');
    previousPage.firstElementChild.setAttribute('aria-disabled', 'false');
    nextPage.firstElementChild.setAttribute('aria-disabled', 'false');
    if (currentPage === 1) {
        previousPage.classList.add('disabled');
        previousPage.firstElementChild.setAttribute('aria-disabled', 'true');
    }
    if (currentPage >= animalsArray.pagination.pages) {
        nextPage.classList.add('disabled');
        nextPage.firstElementChild.setAttribute('aria-disabled', 'true');
    }
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
async function populateAnimalTable(tableBody, animals) {
    if (!tableBody) {
        console.error("tableBody is null");
        return;
    }
    if (!animals || !animals.records) {
        //do something
        return;
    }
    if (!Array.isArray(animals.records)) {
        console.error("records is not an array")
        return;
    }
    //remove all the data in the table
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
function confirmDelete(manageLoadingMessage, deleteAnimal) {
    document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
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
}

// Function to initialize the page
async function initializePage(tableBody, previousPage, nextPage, currentPageSpan, noServiceMessage, noAnimalMessage, loadingMessage) {
    checkIfListIsEmpty(noAnimalMessage, true);
    // show loading message
    manageLoadingMessage(loadingMessage, true);
    try {
        // First, get the total count
        const response = await getAnimals();
        //check if the reponse is define
        if (!response) {
            manageNoServiceMessage(noServiceMessage, true);
            manageLoadingMessage(loadingMessage, false);
            return;
        }

        animalsArray = response;
        perPage = response.pagination.perPage;
        currentPage = response.pagination.page;

        console.log("animalsArray");
        console.log(animalsArray);
        managePagination(previousPage, nextPage, currentPageSpan);
        populateAnimalTable(tableBody, animalsArray);
        //check if there is animal in the table
        if (animalsArray.records.length == 0) {
            checkIfListIsEmpty(noAnimalMessage, true);
        }
        else {
            checkIfListIsEmpty(noAnimalMessage, false);
        }
    } catch (error) {
        const errorMessagebox = document.getElementById('error-message-box');
        if (!errorMessagebox) {
            console.error("errorMessagebox is null");
            return;
        }
        errorMessagebox.classList.remove('d-none');
        console.error('Error fetching animals:', error);
    } finally {
        //hide loading message
        manageLoadingMessage(loadingMessage, false);
    }
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Selectors for DOM elements
    const tableBody = document.querySelector('#animal-table tbody');
    const previousPage = document.getElementById('previousPage');
    const nextPage = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('current-page');
    const noServiceMessage = document.getElementById('no-service-message');
    const noAnimalMessage = document.getElementById('no-animals-message');
    const loadingMessage = document.getElementById('loading-message');
    initializePage(tableBody, previousPage, nextPage, currentPageSpan, noServiceMessage, noAnimalMessage, loadingMessage);
    confirmDelete(manageLoadingMessage, deleteAnimal);
    // Function to handle previous button click
    previousPage.addEventListener('click', async (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            await initializePage(tableBody, previousPage, nextPage, currentPageSpan, noServiceMessage, noAnimalMessage, loadingMessage); // Re-initialize the page with the new data
        }
    });

    // Function to handle next button click
    nextPage.addEventListener('click', async (e) => {
        e.preventDefault();
        if (currentPage < animalsArray.pagination.pages) {
            currentPage++;
            await initializePage(tableBody, previousPage, nextPage, currentPageSpan, noServiceMessage, noAnimalMessage, loadingMessage); // Re-initialize the page with the new data
        }
    });
});