import { getAnimals, deleteAnimal, getAnimalPage } from './animals/animal.service.js';

// Global variable to store the animalId to delete
let animalIdToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
let perPage = 5;
// Global varible for the array of animals
let animalsArray = [];

// Manage error message
function manageErrorMessage(isShow, text) {
    const message = document.getElementById('error-message');
    message.innerText = text;
    if (isShow) {
        message.classList.remove('d-none');
    } else {
        message.classList.add('d-none');
    }
}

// Manage loading message
function manageLoadingMessage(isShow) {
    const message = document.getElementById('loading-message');
    if (isShow) {
        message.classList.remove('d-none');
    } else {
        message.classList.add('d-none');
    }
}

function createEditButton(animal) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('title', 'Edit Animal');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-pen-to-square');
    button.appendChild(icon);
    button.addEventListener('click', () => {
        // Redirect to animal.html with the animalname as a query parameter
        window.location.href = `animal.html?name=${animal.name}`;
    });
    return button;
}

function createDeleteButton(animal) { // Changed to accept the animal object
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-danger', 'btn-sm');
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('title', 'Delete Animal');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash-alt');
    button.appendChild(icon);
    button.addEventListener('click', () => {
        // Set the animal ID to delete in the global variable
        animalIdToDelete = animal.id; // Store the id
        // Show the confirmation modal
        const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.show();
    });
    return button;
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

    animals.forEach((animal) => {
        // ... other code to create the row
        const row = document.createElement('tr');
        row.id = `animal-${animal.id}`; // Assign an ID to the row for easy removal later

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
        const editButton = createEditButton(animal);
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal); // Pass the animal object
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
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
            populateAnimalTable(getCurrentPageAnimals());
        });
    }
}
async function getAnimalsWithDelay(page, perPage) {
    try {
        const response = await getAnimalPage(page, perPage);
        return response;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    if (show) {
        noServiceMessageBox.classList.remove('d-none');
    } else {
        noServiceMessageBox.classList.add('d-none');
    }
}

function manageLoadingPagination(show) {
    const loadingMessageBox = document.getElementById('loading-pagination-message-box');
    if (show) {
        loadingMessageBox.classList.remove('d-none');
    } else {
        loadingMessageBox.classList.add('d-none');
    }
}

// Event listener for the confirm delete button
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
confirmDeleteButton.addEventListener('click', async () => {
    if (!animalIdToDelete) return;

    //hide the modal
    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteConfirmationModal.hide();

    // Show a loading message or spinner here (if you want)
    manageLoadingMessage(true);

    try {
        // Call the deleteAnimal function from animal.service.js
        const response = await deleteAnimal(animalIdToDelete); //pass the id

         // Check if the deletion was successful (e.g., status code 200 OK)
         if (response.status >= 200 && response.status < 300) {

             // Remove the animal row from the table
             const animalRow = document.getElementById(`animal-${animalIdToDelete}`);
             animalRow.remove();

             //check if list is empty
             checkIfListIsEmpty(false);

             // update the current list if there is a pagination
             if (animalsArray.pagination.pages > 1) {
                 const response = await getAnimalsWithDelay(currentPage, perPage);
                 if (!response) {
                     manageNoServiceMessage(true);
                     manageLoadingMessage(false);
                     return;
                 }
                 animalsArray = response;
                 perPage = response.pagination.perPage;
                 currentPage = response.pagination.page;
                 const tableBody = document.querySelector('#animals-list tbody');
                 tableBody.innerHTML = '';
                 managePagination();
                 populateAnimalTable(getCurrentPageAnimals());
             }

         } else {
             // Handle server errors (e.g., show an error message)
             manageErrorMessage(true, "An error as occured on the server");
         }
     } catch (error) {
         // Handle network errors (e.g., show an error message)
         manageErrorMessage(true, "An error as occured on the client");
         console.error('Error deleting animal:', error);
     } finally {
         // hide the loading message
         manageLoadingMessage(false);
     }

    // Clear the animalIdToDelete variable
    animalIdToDelete = null;
});

//manage perPage
const perPageSelect = document.getElementById('perPage');
perPageSelect.addEventListener('change', (event) => {
    perPage = parseInt(event.target.value, 10);
    currentPage = 1;
    getAnimalsWithDelay(currentPage, perPage);
});
// Get animals when the page loads
async function initialisation() {
    manageLoadingMessage(true);
    const response = await getAnimalsWithDelay(currentPage, perPage);
    manageLoadingMessage(false);

    if (!response) {
        manageNoServiceMessage(true);
        return;
    } else {
        animalsArray = response;
    }

    populateAnimalTable(getCurrentPageAnimals());
    managePagination();
    checkIfListIsEmpty(true);
}
initialisation();