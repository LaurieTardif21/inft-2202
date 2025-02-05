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
const API_DELAY = 2000;

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
    const loadingPaginationMessage = document.getElementById('loading-pagination-message-box');
    loadingPaginationMessage.classList.add('d-none');
    checkIfListIsEmpty(false);

}

function checkIfListIsEmpty(isLoading) {
    const tableBody = document.querySelector('#animals-list tbody');
    const messageBox = document.getElementById('message-box');
    const animalListTable = document.getElementById('animals-list');
    if (isLoading) {
        messageBox.classList.add('d-none');
    } else {
        if (tableBody.children.length === 0) {
            animalListTable.classList.add('d-none');
            messageBox.classList.remove('d-none');
        } else {
            animalListTable.classList.remove('d-none');
            messageBox.classList.add('d-none');
        }
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
    const loadingPaginationMessage = document.getElementById('loading-pagination-message-box');
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
            currentPage = i;
            loadingPaginationMessage.classList.remove('d-none');
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
            currentPage--;
            loadingPaginationMessage.classList.remove('d-none');
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
            currentPage++;
            loadingPaginationMessage.classList.remove('d-none');
            tableBody.innerHTML = '';
            managePagination();
            populateAnimalTable(getCurrentPageAnimals());
        });
    }
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
async function initializePage() {
    try {
        //disable the user interaction
        document.body.classList.add('loading');
        //disable the pagination
        const paginationUl = document.getElementById('pagination');
        paginationUl.classList.add('disabled');

        //show that the list is loading
        checkIfListIsEmpty(true);
        const animals = await getAnimalsWithDelay();
        animalsArray = animals;
        managePagination();
        populateAnimalTable(getCurrentPageAnimals());
    } catch (error) {
        console.error('Error fetching animals:', error);
        // Show error message
        const errorMessagebox = document.getElementById('error-message-box');
         if(errorMessagebox){
            errorMessagebox.textContent = "Error fetching animals, please try again later";
            errorMessagebox.classList.remove('d-none');
         }
    } finally {
        //re-enable the user interaction
        document.body.classList.remove('loading');
        //enable the pagination
        const paginationUl = document.getElementById('pagination');
        paginationUl.classList.remove('disabled');
        // Hide loading message
        const loadingMessageBox = document.getElementById('loading-message-box');
        if (loadingMessageBox) {
            loadingMessageBox.classList.add('d-none');
        }
         if (document.getElementById('animals-list').classList.contains('d-none') && document.getElementById('message-box').classList.contains('d-none') && document.getElementById('error-message-box').classList.contains('d-none')) {
            manageNoServiceMessage(true); // Show "no service" message if everything fails
        }
    }
}
// Function to get the animals for the current page
function getCurrentPageAnimals() {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return animalsArray.slice(startIndex, endIndex);
}
// Attach the event listener to the confirmDeleteButton when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading message
    const loadingMessageBox = document.getElementById('loading-message-box');
    if (loadingMessageBox) {
        loadingMessageBox.classList.remove('d-none');
    }
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.addEventListener('click', async () => {
        // Check if the animalIdToDelete is defined
        //disable the user interaction
        document.body.classList.add('loading');
        //disable the pagination
        const paginationUl = document.getElementById('pagination');
        paginationUl.classList.add('disabled');
        if (animalIdToDelete !== null) {
            try {
                await deleteAnimal(animalIdToDelete);
                // Remove the animal in the global array
                const index = animalsArray.findIndex(animal => animal.id === animalIdToDelete);
                if (index !== -1) {
                    animalsArray.splice(index, 1);
                }
                // Remove the row from the table
                const row = document.getElementById(`animal-${animalIdToDelete}`);
                row.remove();
                // Update the empty list message if needed
                checkIfListIsEmpty(false);
                // Update the pagination
                managePagination();
                // Update the table
                populateAnimalTable(getCurrentPageAnimals());
                // Close the modal
                const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                deleteConfirmationModal.hide();
            } catch (error) {
                console.error('Error deleting animal:', error);
                // Show error message
                const errorMessagebox = document.getElementById('error-message-box');
                 if(errorMessagebox){
                     errorMessagebox.textContent = "Error deleting the animal, please try again later";
                    errorMessagebox.classList.remove('d-none');
                 }
            } finally {
                //re-enable the user interaction
                document.body.classList.remove('loading');
                //enable the pagination
                const paginationUl = document.getElementById('pagination');
                paginationUl.classList.remove('disabled');
                  if (document.getElementById('animals-list').classList.contains('d-none') && document.getElementById('message-box').classList.contains('d-none') && document.getElementById('error-message-box').classList.contains('d-none')) {
                    manageNoServiceMessage(true); // Show "no service" message if everything fails
                }
            }
        }
    });
    initializePage();
});