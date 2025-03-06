import { getAnimalPage, deleteAnimal } from './animals/animal.service.js';

// Global variable to store the animal name to delete
let animalIdToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
let perPage = 5;
// Global variable for the array of animals
let animalsArray = [];
// Get the delete confirmation modal
const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
//Manage the confirm button of the modal
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    // Hide the modal
    deleteConfirmationModal.hide();
    //show loading div
    manageLoadingPagination(true);
    //hide no service message
    manageNoServiceMessage(false);
    try {
        // Delete the animal from the database
        await deleteAnimal(animalIdToDelete);

        // Remove the row from the table
        const rowToRemove = document.getElementById(`animal-${animalIdToDelete}`);
        if (rowToRemove) {
            rowToRemove.remove();
        }
        //remove from the array
        animalsArray.records = animalsArray.records.filter((animal) => {
            return animal.name !== animalIdToDelete;
        });
        //manage message if is empty
        checkIfListIsEmpty(false);
        // update the pagination
        managePagination();

    } catch (error) {
        manageNoServiceMessage(true);
        manageLoadingMessage(false);
        console.error('Error during delete operation:', error);
    } finally {
        // Reset the animalIdToDelete
        animalIdToDelete = null;
    }

});

function createEditButton(animal) {
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
        // Redirect to animal.html with the animalname as a query parameter
        window.location.href = `animal.html?name=${animal.name}`;
    });
    return button;
}

function createDeleteButton(animal) {
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
        // Set the animal name to delete in the global variable
        animalIdToDelete = animal.name;
        // Show the confirmation modal
        deleteConfirmationModal.show();
    });
    return button;
}

async function populateAnimalTable(animals) {
    if (!animals || !animals.records) {
        //do something
        return;
    }
    manageNoServiceMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#animals-list tbody');
    tableBody.innerHTML = '';
    manageLoadingPagination(false);

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
        const editButton = createEditButton(animal); // Pass the animal to the edit button
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal); // Pass the animal to the delete button
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
async function managePagination() {
    // Get the container and the ul
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationUl = document.getElementById('pagination');
    //get the previous and next li
    const previousPageLi = document.getElementById('previousPage');
    const nextPageLi = document.getElementById('nextPage');
    // Remove previous page link
    paginationUl.querySelectorAll('.page-number').forEach(li => li.remove());
    // Calculate the number of pages
    const numberOfPages = animalsArray.pagination.pages;

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
            const response = await getAnimalsWithDelay(currentPage, perPage);
            if (!response) {
                manageNoServiceMessage(true);
                manageLoadingMessage(false);
                return;
            }
            animalsArray = response;
            perPage = response.pagination.perPage;
            currentPage = response.pagination.page;
            checkIfListIsEmpty(false);
            tableBody.innerHTML = '';
            managePagination(); // Update the pagination
            populateAnimalTable(animalsArray);
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
            const response = await getAnimalsWithDelay(currentPage, perPage);
            if (!response) {
                manageNoServiceMessage(true);
                manageLoadingMessage(false);
                return;
            }
            animalsArray = response;
            perPage = response.pagination.perPage;
            currentPage = response.pagination.page;
            checkIfListIsEmpty(false);
            tableBody.innerHTML = '';
            managePagination();
            populateAnimalTable(animalsArray);
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
            const response = await getAnimalsWithDelay(currentPage, perPage);
            if (!response) {
                manageNoServiceMessage(true);
                manageLoadingMessage(false);
                return;
            }
            animalsArray = response;
            perPage = response.pagination.perPage;
            currentPage = response.pagination.page;
            checkIfListIsEmpty(false);
            tableBody.innerHTML = '';
            managePagination();
            populateAnimalTable(animalsArray);
        });
    }
}
async function getAnimalsWithDelay(page, perPage) {
    const response = await getAnimalPage(page, perPage);
    return response;

}

function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    const animalListTable = document.getElementById('animals-list');
    if (show) {
        noServiceMessageBox.classList.remove('d-none');
        animalListTable.classList.add('d-none');
    } else {
        noServiceMessageBox.classList.add('d-none');
        animalListTable.classList.remove('d-none');
    }
}
function manageLoadingPagination(isLoading) {
    const loadingMessage = document.getElementById('loading-message-box');
    const pagination = document.getElementById('paginationContainer');
    const animalListTable = document.getElementById('animals-list');
    if (isLoading) {
        loadingMessage.classList.remove('d-none');
        pagination.classList.add('d-none');
        animalListTable.classList.add('d-none');
    } else {
        loadingMessage.classList.add('d-none');
        pagination.classList.remove('d-none');
        animalListTable.classList.remove('d-none');
    }
}
function manageLoadingMessage(isLoading) {
    const loadingMessage = document.getElementById('loading-message-box');
    if (isLoading) {
        loadingMessage.classList.remove('d-none');
    } else {
        loadingMessage.classList.add('d-none');
    }
}

// Load the initial data
document.addEventListener('DOMContentLoaded', async () => {
    manageLoadingMessage(true);
    const response = await getAnimalsWithDelay(currentPage, perPage);
    if (!response) {
        manageNoServiceMessage(true);
        manageLoadingMessage(false);
        return;
    }
    animalsArray = response;
    perPage = response.pagination.perPage;
    currentPage = response.pagination.page;
    checkIfListIsEmpty(false);
    populateAnimalTable(animalsArray);
    managePagination();
    manageLoadingMessage(false);
});