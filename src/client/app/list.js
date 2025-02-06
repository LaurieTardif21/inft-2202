import { getAnimals, deleteAnimal } from './animals/animal.service.js';

// Global variable to store the animalId to delete
let animalIdToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
const perPage = 5;
// Global varible for the array of animals
let animalsArray = [];
// Simulate API delay for 2 seconds
const API_DELAY = 5000; // Increased delay for testing

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

async function populateAnimalTable(animals) {
    console.log("populateAnimalTable: start");
    manageNoServiceMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#animals-list tbody');

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
    checkIfListIsEmpty(false);
    console.log("populateAnimalTable: end");
    manageLoadingPagination(false);

}

function checkIfListIsEmpty(isLoading) {
    const tableBody = document.querySelector('#animals-list tbody');
    const messageBox = document.getElementById('message-box');
    const animalListTable = document.getElementById('animals-list');
    const errorMessagebox = document.getElementById('error-message-box');
    if (isLoading) {
        messageBox.classList.add('d-none');
    } else {
        if (tableBody.children.length === 0) {
            if (errorMessagebox.classList.contains('d-none')) {
                animalListTable.classList.add('d-none');
                messageBox.classList.remove('d-none');
            }
            
        } else {
            animalListTable.classList.remove('d-none');
            messageBox.classList.add('d-none');
        }
    }
}
// Function to create and manage the pagination
function managePagination() {
    console.log("managePagination: start");
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
    const tableBody = document.querySelector('#animals-list tbody');

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
            console.log(`Pagination link clicked: Page ${i}`);
            //show loading div
            manageLoadingPagination(true);
             //hide no service message
             manageNoServiceMessage(false);
            currentPage = i;
            tableBody.innerHTML = '';
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
        //remove the old event
        previousPageLi.querySelector('a').replaceWith(previousPageLi.querySelector('a').cloneNode(true));
        previousPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Previous page link clicked");
            //show loading div
            manageLoadingPagination(true);
             //hide no service message
             manageNoServiceMessage(false);
            currentPage--;
            tableBody.innerHTML = '';
            managePagination();
            populateAnimalTable(getCurrentPageAnimals());
        });
    }

    //Manage the next button
    nextPageLi.classList.toggle('disabled', currentPage === numberOfPages);
    //add the event if is not disabled
    if (currentPage !== numberOfPages) {
        //remove the old event
        nextPageLi.querySelector('a').replaceWith(nextPageLi.querySelector('a').cloneNode(true));
        nextPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Next page link clicked");
            //show loading div
            manageLoadingPagination(true);
             //hide no service message
             manageNoServiceMessage(false);
            currentPage++;
            tableBody.innerHTML = '';
            managePagination();
            populateAnimalTable(getCurrentPageAnimals());
        });
    }
    console.log("managePagination: end");
}
async function getAnimalsWithDelay() {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const animals = await getAnimals();
            resolve(animals)
        }, API_DELAY);
    })
}

function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    const animalListTable = document.getElementById('animals-list');
    const loadingMessageBox = document.getElementById('loading-message-box');
    const messageBox = document.getElementById('message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    const paginationContainer = document.getElementById('paginationContainer');

    if (show) {
        //show the no service message and hide everything else
        noServiceMessageBox.classList.remove('d-none');
        animalListTable.classList.add('d-none');
        loadingMessageBox.classList.add('d-none');
        messageBox.classList.add('d-none');
        errorMessagebox.classList.add('d-none');
        paginationContainer.classList.add('d-none');

    } else {
        noServiceMessageBox.classList.add('d-none');
    }
}
function manageLoadingPagination(show) {
    console.log(`manageLoadingPagination: ${show ? 'show' : 'hide'}`);
    const loadingPaginationMessage = document.getElementById('loading-pagination-message-box');
    if (show) {
        loadingPaginationMessage.classList.remove('d-none');
    } else {
        loadingPaginationMessage.classList.add('d-none');
    }
}
async function initializePage() {
    console.log("initializePage: start");
    //manage the loading message
    const loadingMessage = document.getElementById('loading-message-box');
    const animalListTable = document.getElementById('animals-list');
    const errorMessagebox = document.getElementById('error-message-box');
    try {
        //show the loading
        loadingMessage.classList.remove('d-none');
        animalListTable.classList.add('d-none');
        //get the animals
        const animals = await getAnimalsWithDelay();
        //save the array
        animalsArray = animals;
        //check if there is animals
        if (animals.length === 0) {
            checkIfListIsEmpty(true);
        } else {
            // Populate the table with the animals
            populateAnimalTable(getCurrentPageAnimals());
            //manage the pagination
            managePagination();
            //hide the error
            errorMessagebox.classList.add('d-none');
        }

    } catch (error) {
        //hide the loading
        loadingMessage.classList.add('d-none');
        //show the error message
        errorMessagebox.classList.remove('d-none');
        errorMessagebox.textContent = "An error occurred while loading the animals. Please try again later.";
        console.error("Error loading animals:", error);

    } finally {
        // Hide the loading message
        loadingMessage.classList.add('d-none');
    }
    console.log("initializePage: end");
}

function getCurrentPageAnimals() {
    console.log("getCurrentPageAnimals");
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return animalsArray.slice(startIndex, endIndex);
}
// Delete logic
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener('click', async () => {
        // Hide the modal
        const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.hide();

        if (animalIdToDelete) {
            try {
                await deleteAnimal(animalIdToDelete);
                // Remove the deleted animal from the UI
                const rowToRemove = document.getElementById(`animal-${animalIdToDelete}`);
                if (rowToRemove) {
                    rowToRemove.remove();
                }
                //reset the animal to delete
                animalIdToDelete = null;
            } catch (error) {
                console.error("Error deleting animal:", error);
            }
        }
    });
}
//call the initialization of the page
initializePage();