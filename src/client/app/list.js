import { getAnimals, deleteAnimal } from './animals/animal.service.js';

// Global variable to store the animalId to delete
let animalIdToDelete = null;
// Global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
let perPage = 5;
// Global varible for the array of animals
let animalsArray = [];

// Function to call when the page is load.
async function init() {
    //show loading div
    manageLoadingMessage(true);
    //hide no service message
    manageNoServiceMessage(false);
    //Get the data
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
    // Populate the table
    drawAnimalTable(getCurrentPageAnimals());
    // Update the pagination
    drawPagination(animalsArray.pagination);
    manageLoadingMessage(false);
}

// Function to create and manage the pagination
function drawPagination({ page = 1, perPage = 5, pages = 10 }) {
    // Get the container and the ul
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';
    const previousPageLi = document.createElement('li');
    previousPageLi.id = 'previousPage'
    const nextPageLi = document.createElement('li');
    nextPageLi.id = 'nextPage'
    function addPage(number, text, style) {
        return `<li class="page-item ${style}">
          <a class="page-link" href="./list.html?page=${number}&perPage=${perPage}">${text}</a>
        </li>`
    }
    const pagination = document.createElement('div');
    if (pages > 1) {
        paginationContainer.classList.remove('d-none');
    } else {
        paginationContainer.classList.add('d-none');
        return;
    }
    const ul = document.createElement("ul");
    ul.classList.add('pagination')
    ul.insertAdjacentHTML('beforeend', addPage(page - 1, 'Previous', (page == 1) ? 'disabled' : ''))
    for (let i = 1; i <= pages; i++) {
        ul.insertAdjacentHTML('beforeend', addPage(i, i, (i == page) ? 'active' : ''));
    }
    ul.insertAdjacentHTML('beforeend', addPage(page + 1, 'Next', (page == pages) ? 'disabled' : ''))

    pagination.append(ul);
    //Add the ul in the container
    paginationContainer.appendChild(ul);

    const tableBody = document.querySelector('#animals-list tbody');
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
            drawAnimalTable(getCurrentPageAnimals());
            drawPagination(animalsArray.pagination);
            manageLoadingPagination(false);
        });
    }
    //Manage the next button
    nextPageLi.classList.toggle('disabled', currentPage === pages);
    //add the event if is not disabled
    if (currentPage !== pages) {
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
            drawAnimalTable(getCurrentPageAnimals());
            drawPagination(animalsArray.pagination);
            manageLoadingPagination(false);
        });
    }
    return pagination;
}
function drawAnimalTable(animals) {
    const tableBody = document.querySelector('#animals-list tbody');
    tableBody.innerHTML = '';
    const eleTable = document.getElementById('animals-list');
    // Create a <thead> element
    const thead = eleTable.createTHead();
    // Create a row in the <thead>
    thead.innerHTML = '';
    const row = thead.insertRow();
    // Create and append header cells
    const headers = ['Name', 'Breed', 'Legs', 'Eyes', 'Sound'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        row.appendChild(th);
    });
    for (let animal of animals) {
        const row = eleTable.insertRow();
        row.id = `animal-${animal.name}`;
        // create some rows for each animal field
        row.insertCell().textContent = animal.name;
        row.insertCell().textContent = animal.breed;
        row.insertCell().textContent = animal.legs;
        row.insertCell().textContent = animal.eyes;
        row.insertCell().textContent = animal.sound;
        // create a cell to hold the buttons
        const eleBtnCell = row.insertCell();
        eleBtnCell.classList.add();
        // create a delete button
        const eleBtnDelete = document.createElement('button');
        eleBtnDelete.classList.add('btn', 'btn-danger', 'mx-1');
        eleBtnDelete.innerHTML = `<i class="fa fa-trash"></i>`;
        eleBtnDelete.setAttribute('data-bs-toggle', 'tooltip'); // Enable tooltip
        eleBtnDelete.setAttribute('data-bs-placement', 'top'); // Set tooltip placement
        eleBtnDelete.setAttribute('title', 'Delete Animal'); // Set tooltip text
        eleBtnDelete.addEventListener('click', onDeleteButtonClick(animal));
        // add the delete button to the button cell
        eleBtnCell.append(eleBtnDelete);
        // create an edit button
        const eleBtnEdit = document.createElement('a');
        eleBtnEdit.classList.add('btn', 'btn-primary', 'mx-1');
        eleBtnEdit.innerHTML = `<i class="fa fa-user"></i>`;
        eleBtnEdit.href = `./animal.html?name=${animal.name}`
        eleBtnEdit.setAttribute('data-bs-toggle', 'tooltip'); // Enable tooltip
        eleBtnEdit.setAttribute('data-bs-placement', 'top'); // Set tooltip placement
        eleBtnEdit.setAttribute('title', 'Edit Animal'); // Set tooltip text
        // add the edit button to the button cell
        eleBtnCell.append(eleBtnEdit);
    }
    // Initialize Bootstrap tooltips after the table is populated
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    return eleTable;
}
function onDeleteButtonClick(animal) {
    return async event => {
        // Set the animal ID to delete in the global variable
        animalIdToDelete = animal.name;
        // Show the confirmation modal
        const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.show();
    }
}
function checkIfListIsEmpty(isLoading) {
    const tableBody = document.querySelector('#animals-list tbody');
    const messageBox = document.getElementById('message-box');
    const animalListTable = document.getElementById('animals-list');
    const errorMessagebox = document.getElementById('error-message-box');
    if (isLoading) {
        messageBox.classList.add('d-none');
        animalListTable.classList.add('d-none');
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

// Function to confirm and delete an animal
async function confirmDeleteAnimal() {
    // Hide the confirmation modal
    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteConfirmationModal.hide();
    //show the loading message
    manageLoadingMessage(true);
    // Make sure there is an ID to delete
    if (animalIdToDelete) {
        try {
            // Call the API to delete the animal
            const deleted = await deleteAnimal(animalIdToDelete);
            if (!deleted) {
                manageLoadingMessage(false);
                manageNoServiceMessage(true);
                return;
            }
            // Delete the row from the UI
            const rowToRemove = document.getElementById(`animal-${animalIdToDelete}`);
            if (rowToRemove) {
                rowToRemove.remove();
            }
            //reset the value
            animalIdToDelete = null;

            //Update the list if needed
            checkIfListIsEmpty(false);

            //manage the pagination.
            drawPagination(animalsArray.pagination);

            //remove the loading message
            manageLoadingMessage(false);
        } catch (error) {
            // Handle error: e.g., show an error message to the user
            console.error('Error deleting animal:', error);
            manageLoadingMessage(false);
            manageNoServiceMessage(true);
        }
    } else {
        // Handle the case where animalIdToDelete is null or undefined
        console.error('No animal ID to delete.');
        manageLoadingMessage(false);
    }
}

// Add an event listener to the confirm button in the modal
document.getElementById('confirmDeleteButton').addEventListener('click', confirmDeleteAnimal);

async function getAnimalsWithDelay(page, perPage) {
    const response = await getAnimals(page, perPage);
    return response;

}

function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    if (show) {
        noServiceMessageBox.classList.remove('d-none');
    } else {
        noServiceMessageBox.classList.add('d-none');
    }
}

function manageLoadingMessage(show) {
    const loadingMessageBox = document.getElementById('loading-message-box');
    if (show) {
        loadingMessageBox.classList.remove('d-none');
    } else {
        loadingMessageBox.classList.add('d-none');
    }
}

function manageLoadingPagination(show) {
    const loadingPaginationDiv = document.getElementById('loading-pagination-message-box');
    if (show) {
        loadingPaginationDiv.classList.remove('d-none');
    } else {
        loadingPaginationDiv.classList.add('d-none');
    }
}

function getCurrentPageAnimals() {
    return animalsArray.records;
}

//call the init function to load the list of animals
init();