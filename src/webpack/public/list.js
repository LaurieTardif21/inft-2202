import { getAnimalPage, deleteAnimal } from './animals/animal.service.js';

// Global variable to store the animalId to delete
let animalIdToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
let perPage = 5;
// Global varible for the array of animals
let animalsArray = [];

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
        // Redirect to animal page with the animal name as a query parameter
        window.history.pushState(null, '', `/animal?name=${animal.name}`); // Update URL
        navigateTo(`/animal?name=${animal.name}`); // Load content
    });
    return button;
}

// Event listener for confirmDeleteButton outside of button creation logic
document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
    if (animalIdToDelete !== null) {
        try {
            await confirmDeleteAnimal(animalIdToDelete); // Confirm delete and delete the animal
        } catch (error) {
            console.error('Error during deletion', error);
        } finally {
            // Close the modal after deletion
            const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
            deleteConfirmationModal.hide();
        }
    }
});

// Create the delete button function
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

// Confirm the delete operation
async function confirmDeleteAnimal(animalId) {
    if (!animalId) return;

    try {
        await deleteAnimal(animalId); // Call the delete function

        // Remove the row from the table after successful deletion
        const deletedRow = document.getElementById(`animal-${animalId}`);
        if (deletedRow) {
            deletedRow.remove();
        }

        // Reset the global delete variable
        animalIdToDelete = null;

        // Check if the list is empty and update UI
        checkIfListIsEmpty(false);
    } catch (error) {
        console.error("Error deleting animal:", error);
        alert("Failed to delete animal. Please try again.");
    }
}

async function getAnimalsWithDelay(page, perPage) {
    try {
        const response = await getAnimalPage(page, perPage);
        return response; // Return the response data
    } catch (error) {
        console.error('Error fetching animal page:', error);
        return null;
    }
}

function manageLoadingPagination(isLoading) {
    const loadingPaginationDiv = document.getElementById('loading-pagination');
    if (isLoading) {
        loadingPaginationDiv.classList.remove('d-none');
    } else {
        loadingPaginationDiv.classList.add('d-none');
    }
}
function manageNoServiceMessage(show) {
    const errorMessagebox = document.getElementById('error-message-box');
    if (show) {
        errorMessagebox.classList.remove('d-none');
    } else {
        errorMessagebox.classList.add('d-none');
    }
}
function manageLoadingMessage(isLoading) {
    const loadingDiv = document.getElementById('loading');
    if (isLoading) {
        loadingDiv.classList.remove('d-none');
    } else {
        loadingDiv.classList.add('d-none');
    }
}
// Function to get the animals for the current page
function getCurrentPageAnimals() {
    return animalsArray.data;
}
async function populateAnimalTable(animals) {
    if (!animals) {
        //do something
        return;
    }
    manageNoServiceMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#animals-list tbody');
    manageLoadingPagination(false);
    tableBody.innerHTML = ''; // clear the table

    animals.forEach((animal) => {
        // ... other code to create the row
        const row = document.createElement('tr');
        row.id = `animal-${animal.id}`; // Assign an ID to the row for easy removal later

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
            managePagination(); // Update the pagination
            populateAnimalTable(getCurrentPageAnimals());
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
            managePagination(); // Update the pagination
            populateAnimalTable(getCurrentPageAnimals());
        });
    }
}
async function list() {
    const response = await getAnimalsWithDelay(currentPage, perPage);
    if (!response) {
        manageNoServiceMessage(true);
        manageLoadingMessage(false);
        return;
    }
    animalsArray = response;
    perPage = response.pagination.perPage;
    currentPage = response.pagination.page;

    manageLoadingMessage(false);
    populateAnimalTable(getCurrentPageAnimals());
    managePagination();

    return document.getElementById('animals-list');
}

export default list;