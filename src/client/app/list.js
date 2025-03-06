import { getAnimals, deleteAnimal } from './animals/animal.service.js';

// Global variable to store the animalId to delete
let animalIdToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
let perPage = 5;
// Global varible for the array of animals
let animalsArray = [];
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
function getCurrentPageAnimals() {
    if (animalsArray.data) {
        return animalsArray.data;
    }
    return null;
}
function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    const animalListTable = document.getElementById('animals-list');
    if (show) {
        noServiceMessageBox.classList.remove('d-none');
        errorMessagebox.classList.remove('d-none');
        animalListTable.classList.add('d-none');
    } else {
        noServiceMessageBox.classList.add('d-none');
        errorMessagebox.classList.add('d-none');
        animalListTable.classList.remove('d-none');
    }
}
function manageLoadingMessage(isLoading) {
    const loadingSpinnerMessage = document.getElementById('loading-spinner-message');
    const messageBox = document.getElementById('message-box');
    const tableBody = document.querySelector('#animals-list tbody');
    if (isLoading) {
        loadingSpinnerMessage.classList.remove('d-none');
        messageBox.classList.add('d-none');
        tableBody.classList.add('d-none');
    } else {
        loadingSpinnerMessage.classList.add('d-none');
        messageBox.classList.add('d-none');
        tableBody.classList.remove('d-none');
    }
}
async function getAnimalsWithDelay(page, perPage) {
    const response = await getAnimals(page, perPage);
    console.log("Response in getAnimalsWithDelay:", response);
    return response;

}
async function populateAnimalTable(animals) {
    console.log("Animals in populateAnimalTable:", animals);
    if (!animals) {
        return;
    }
    manageNoServiceMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#animals-list tbody');
    animals.forEach((animal) => {
        const row = document.createElement('tr');
        row.id = `animal-${animal.id}`;
        const nameCell = document.createElement('td');
        nameCell.textContent = animal.name;
        row.appendChild(nameCell);
        const breedCell = document.createElement('td');
        breedCell.textContent = animal.breed;
        row.appendChild(breedCell);
        const eyesCell = document.createElement('td');
        eyesCell.textContent = animal.eyes;
        row.appendChild(eyesCell);
        const legsCell = document.createElement('td');
        legsCell.textContent = animal.legs;
        row.appendChild(legsCell);
        const soundCell = document.createElement('td');
        soundCell.textContent = animal.sound;
        row.appendChild(soundCell);
        const actionsCell = document.createElement('td');
        const deleteButton = createDeleteButton(animal.id);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);

    });
    // Initialize Bootstrap tooltips after the table is populated
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}
function checkIfListIsEmpty(isLoading) {
    const tableBody = document.querySelector('#animals-list tbody');
    const messageBox = document.getElementById('message-box');
    const animalListTable = document.getElementById('animals-list');
    const errorMessagebox = document.getElementById('error-message-box');
    if (isLoading) {
        // If it's loading, hide the message box
        messageBox.classList.add('d-none');
    } else {
        // If it's not loading, check if the table is empty
        if (tableBody.children.length === 0) {
            // If the table is empty and there are no errors, show the message box
            if (errorMessagebox.classList.contains('d-none')) {
                animalListTable.classList.add('d-none');
                messageBox.classList.remove('d-none');
            }
        } else {
            // If the table is not empty, hide the message box
            animalListTable.classList.remove('d-none');
            messageBox.classList.add('d-none');
        }
    }
}
// Add an event listener to the "Delete" button in the modal
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    // Hide the modal
    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteConfirmationModal.hide();

    // Check if there is an animal to delete
    if (animalIdToDelete !== null) {
        //show loading
        manageLoadingMessage(true);
        manageNoServiceMessage(false);
        // Call the delete function
        const success = await deleteAnimal(animalIdToDelete);
        console.log("success in listjs", success);
        if (success) {
            //remove the row
            const rowToRemove = document.getElementById(`animal-${animalIdToDelete}`);
            rowToRemove.remove();
            // Get the current animals
            const currentAnimals = getCurrentPageAnimals();
             console.log("current animal",currentAnimals);
            //if there is no more animal
            if (!currentAnimals || currentAnimals.length === 0) {
                currentPage = 1;
                const response = await getAnimalsWithDelay(currentPage, perPage);
                if (!response) {
                    manageNoServiceMessage(true);
                    manageLoadingMessage(false);
                    return;
                }
                animalsArray = response;
                perPage = response.pagination.perPage;
                currentPage = response.pagination.page;
                //clear the table
                const tableBody = document.querySelector('#animals-list tbody');
                tableBody.innerHTML = '';
                //populate
                populateAnimalTable(getCurrentPageAnimals());
            }
            //repopulate the list
            checkIfListIsEmpty(false);
        } else {
            manageNoServiceMessage(true);
        }

        // Reset the animalIdToDelete
        animalIdToDelete = null;
        //hide loading
        manageLoadingMessage(false);
    }
});
async function initializePage() {
    //show loading div
    manageLoadingMessage(true);
    //hide no service message
    manageNoServiceMessage(false);
    const response = await getAnimalsWithDelay(currentPage, perPage);
    if (!response) {
        manageNoServiceMessage(true);
        manageLoadingMessage(false);
        return;
    }
    animalsArray = response;
    perPage = response.pagination.perPage;
    currentPage = response.pagination.page;
    //populate the table
    populateAnimalTable(getCurrentPageAnimals());
    //check if is empty
    checkIfListIsEmpty(false);
    manageLoadingMessage(false);
}
//initialize
initializePage();