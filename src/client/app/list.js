import { getAnimals, deleteAnimal } from './animals/animal.service.js';

// Global variable to store the animalId to delete
let animalIdToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
const perPage = 5;
// Global variable for the array of animals
let animalsArray = [];
// Simulate API delay for 0.5 seconds
const API_DELAY = 500;
// Get the container and the ul
const paginationContainer = document.getElementById('paginationContainer');
const paginationUl = document.getElementById('pagination');
//get the previous and next li
const previousPageLi = document.getElementById('previousPage');
const nextPageLi = document.getElementById('nextPage');
const tableBody = document.querySelector('#animals-list tbody');
const messageBox = document.getElementById('message-box');
const animalListTable = document.getElementById('animals-list');
const errorMessagebox = document.getElementById('error-message-box');
const deleteModal = document.getElementById('deleteConfirmationModal');
// Handle Modal Show
deleteModal.addEventListener('show.bs.modal', () => {
    deleteModal.removeAttribute('inert');
});

// Handle Modal Hide
deleteModal.addEventListener('hidden.bs.modal', () => {
    deleteModal.setAttribute('inert', 'true');
    // Find the currently focused element inside the modal
    const focusedElement = deleteModal.querySelector(':focus');
    if (focusedElement) {
        focusedElement.blur();
    }
});
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

function populateTable(animals) {
    //clear the table
    tableBody.innerHTML = '';
    animals.forEach((animal) => {
        const row = document.createElement('tr');
        row.id = `animal-${animal.id}`; // Assign an ID to the row for easy removal later

        const nameCell = document.createElement('td');
        nameCell.textContent = animal.name;
        row.appendChild(nameCell);

        const breedCell = document.createElement('td');
        breedCell.textContent = animal.description;
        row.appendChild(breedCell);

        const eyesCell = document.createElement('td');
        eyesCell.textContent = animal.stock;
        row.appendChild(eyesCell);

        const legsCell = document.createElement('td');
        legsCell.textContent = "not available";
        row.appendChild(legsCell);

        const soundCell = document.createElement('td');
        soundCell.textContent = "$"+ animal.price;
        row.appendChild(soundCell);

        const actionsCell = document.createElement('td');
        const editButton = createEditButton(animal.id); // Pass the animal ID to the edit button
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal.id); // Pass the animal ID to the delete button
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
    // Remove previous page link
    paginationUl.querySelectorAll('.page-number').forEach(li => li.remove());
    // Calculate the number of pages
    const numberOfPages = Math.ceil(animalsArray.length / perPage);

    //check if there is more than 5 animals
    if (animalsArray.length > perPage) {
        paginationContainer.classList.remove('d-none');
    } else {
        paginationContainer.classList.add('d-none');
        return;
    }
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
            //show loading div
            manageLoadingPagination(true);
            //hide no service message
            manageNoServiceMessage(false);
            currentPage = i;
            populateTable(getCurrentPageAnimals());
            managePagination();
        });

        //append the elements
        pageNumberLi.appendChild(pageNumberLink);
        paginationUl.insertBefore(pageNumberLi, nextPageLi);
    }

    //Manage the previous button
    previousPageLi.classList.toggle('disabled', currentPage === 1);
    //add the event if is not disabled
    previousPageLi.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            //show loading div
            manageLoadingPagination(true);
            //hide no service message
            manageNoServiceMessage(false);
            currentPage--;
            populateTable(getCurrentPageAnimals());
            managePagination();
        }

    });


    //Manage the next button
    nextPageLi.classList.toggle('disabled', currentPage === numberOfPages);
    //add the event if is not disabled
    nextPageLi.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage < numberOfPages) {
            //show loading div
            manageLoadingPagination(true);
            //hide no service message
            manageNoServiceMessage(false);
            currentPage++;
            populateTable(getCurrentPageAnimals());
            managePagination();
        }
    });
    checkIfListIsEmpty(false);
}
async function getAnimalsWithDelay() {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                const animals = await getAnimals();
                resolve(animals)
            } catch (error) {
                throw error; //rethrow the error
            }
        }, API_DELAY);
    })
}
function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    const animalListTable = document.getElementById('animals-list');
    const loadingMessageBox = document.getElementById('loading-message-box');
    const messageBox = document.getElementById('message-box');
    const errorMessagebox = document.getElementById('error-message-box');
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
    const loadingPaginationMessage = document.getElementById('loading-pagination-message-box');
    if (show) {
        loadingPaginationMessage.classList.remove('d-none');
    } else {
        loadingPaginationMessage.classList.add('d-none');
    }
}

// Function to get the animals for the current page
function getCurrentPageAnimals() {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    return animalsArray.slice(start, end);
}

// Function to initialize the page
async function initializePage() {
    //show loading div
    manageLoadingPagination(true);
    //hide no service message
    manageNoServiceMessage(false);
    try {
        const animals = await getAnimalsWithDelay();//get the animals with the delay
        animalsArray = animals; //save the array
        populateTable(getCurrentPageAnimals()); //populate the table
        managePagination(); // manage the pagination
    } catch (error) {
        manageNoServiceMessage(true);
        console.error("Error fetching animals:", error);
    }
    checkIfListIsEmpty(false);
}

// Initialize the page
initializePage();