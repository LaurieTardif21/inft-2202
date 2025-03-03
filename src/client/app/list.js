import animalService from './animals/animal.service.js';

// Global variable to store the animalName to delete
let animalNameToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
let perPage = 5;
// Global varible for the array of animals
let animalsArray = [];

// Page elements
const animalsList = document.getElementById('animals-list');
const animalsListBody = animalsList.querySelector('tbody');
const loadingMessageBox = document.getElementById('loading-message-box');
const pagination = document.getElementById('pagination');
const previousPage = document.getElementById('previousPage');
const nextPage = document.getElementById('nextPage');
const loadingPaginationMessageBox = document.getElementById('loading-pagination-message-box');
const messageBox = document.getElementById('message-box');
const errorMessage = document.getElementById('error-message-box');
const noServiceMessageBox = document.getElementById('no-service-message-box');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const loadingSpinner = document.getElementById('loading-spinner');
const paginationContainer = document.getElementById('paginationContainer');

function createEditButton(animalName) {
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
        // Redirect to animal.html with the animalName as a query parameter
        window.location.href = `animal.html?id=${animalName}`;
    });
    return button;
}

function createDeleteButton(animalName) {
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
        animalNameToDelete = animalName;
        // Show the confirmation modal
        const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.show();
    });
    return button;
}
function manageErrorMessage(show) {
    if (show) {
        errorMessage.classList.remove('d-none');
    } else {
        errorMessage.classList.add('d-none');
    }
}

function manageLoadingMessage(show) {
    if (show) {
        loadingMessageBox.classList.remove('d-none');
    } else {
        loadingMessageBox.classList.add('d-none');
    }
}
function manageNoServiceMessage(show) {
    if (show) {
        noServiceMessageBox.classList.remove('d-none');
    } else {
        noServiceMessageBox.classList.add('d-none');
    }
}

function manageLoadingPagination(show) {
    if (show) {
        loadingPaginationMessageBox.classList.remove('d-none');
    } else {
        loadingPaginationMessageBox.classList.add('d-none');
    }
}

async function populateAnimalTable(animals) {
    if (!animals) {
        return;
    }
    manageNoServiceMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#animals-list tbody');
    manageLoadingPagination(false);
    // Clear existing rows
    tableBody.innerHTML = '';
    animals.forEach((animal) => {
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
        const editButton = createEditButton(animal.name); // Pass the animal Name to the edit button
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal.name); // Pass the animal Name to the delete button
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
async function managePagination(numberOfPages) {
    // Get the container and the ul
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationUl = document.getElementById('pagination');
    //get the previous and next li
    const previousPageLi = document.getElementById('previousPage');
    const nextPageLi = document.getElementById('nextPage');
    // Remove previous page link
    paginationUl.querySelectorAll('.page-number').forEach(li => li.remove());

    //check if there is more than 5 animals
    if (numberOfPages > 1) {
        paginationContainer.classList.remove('d-none');
    } else {
        paginationContainer.classList.add('d-none');
        return;
    }
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
        pageNumberLink.addEventListener('click', async (event) => {
            event.preventDefault();
            //show loading div
            manageLoadingPagination(true);
            //hide no service message
            manageNoServiceMessage(false);
            currentPage = i;
            await loadAnimals();
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
        previousPageLi.querySelector('a').addEventListener('click', async (event) => {
            event.preventDefault();
            //show loading div
            manageLoadingPagination(true);
            //hide no service message
            manageNoServiceMessage(false);
            currentPage--;
            await loadAnimals();
        });
    }

    //Manage the next button
    nextPageLi.classList.toggle('disabled', currentPage === numberOfPages);
    //add the event if is not disabled
    if (currentPage !== numberOfPages) {
        //remove the old event
        nextPageLi.querySelector('a').replaceWith(nextPageLi.querySelector('a').cloneNode(true));
        nextPageLi.querySelector('a').addEventListener('click', async (event) => {
            event.preventDefault();
            //show loading div
            manageLoadingPagination(true);
            //hide no service message
            manageNoServiceMessage(false);
            currentPage++;
            await loadAnimals();
        });
    }
}
async function getAnimalsWithDelay(page, perPage) {
    try {
        const response = await animalService.getAnimalPage({ page, perPage });

        if (response) {
            return response;
        } else {
            console.log("getAnimalsWithDelay returning empty data");
            return null;
        }
    }
    catch (error){
        console.error('Error getting animals:', error);
        return null;
    }
}

async function loadAnimals() {
    manageLoadingPagination(true);
    //hide no service message
    manageNoServiceMessage(false);
    //hide error message
    manageErrorMessage(false);
    animalsList.classList.add('d-none');//hide table
    pagination.classList.add('d-none');//hide pagination
    try {
        const animals = await getAnimalsWithDelay(currentPage, perPage);

        if(animals){
            //check if there is data
            if(animals.length > 0){
                 // Update the global variables
                animalsArray = animals;
                // Calculate the number of pages
                const numberOfPages = Math.ceil(animals.length/perPage);
                // Show the table
                populateAnimalTable(getCurrentPageAnimals());
                // Show the pagination
                managePagination(numberOfPages);
                paginationContainer.classList.remove('d-none');//show pagination
            } else {
                checkIfListIsEmpty(false);
                paginationContainer.classList.add('d-none');//hide pagination
            }

        } else{
            //show no service message
            manageNoServiceMessage(true);
        }

    } catch (error) {
        manageErrorMessage(true);
        console.error('Failed to load animals:', error);
    } finally {
        manageLoadingPagination(false);
    }
}

function getCurrentPageAnimals() {
    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    // Slice the array to get the animals for the current page
    return animalsArray.slice(startIndex, endIndex);
}
// Handle delete
confirmDeleteButton.addEventListener('click', async () => {
    if (animalNameToDelete) {
        manageLoadingMessage(true);
        try {
            // Show spinner
            loadingSpinner.classList.remove('d-none');
            await animalService.deleteAnimal(animalNameToDelete);
            // Reload animals
            await loadAnimals();
        } catch (error) {
            console.error('Error deleting animal:', error);
            manageErrorMessage(true);
        } finally {
            // Hide spinner
            loadingSpinner.classList.add('d-none');
            manageLoadingMessage(false);
        }
    }
    // Hide modal
    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteConfirmationModal.hide();
});
// Handle timeout and no service
let timeoutId; // Define timeoutId in the outer scope

async function initialize() {
    try {
        timeoutId = setTimeout(() => {
            console.log("Timeout triggered");
            noServiceMessageBox.classList.remove('d-none'); // Show "no service" message
            loadingMessageBox.classList.add('d-none'); // Hide "loading" message
            clearTimeout(timeoutId);
        }, 5000);
        // Load animals
        await loadAnimals();
    } catch (error) {
        console.error('Initialization failed:', error);
        // Handle the error during initialization
    } finally {
        clearTimeout(timeoutId);
        loadingMessageBox.classList.add('d-none');
        noServiceMessageBox.classList.add('d-none');
    }
}

initialize();