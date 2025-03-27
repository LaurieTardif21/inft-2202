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
        // Redirect to animal.html with the animalname as a query parameter
        window.history.pushState(null, '', `/animal?name=${encodeURIComponent(animal.name)}`);
        navigateTo(`/animal?name=${encodeURIComponent(animal.name)}`);
    });
    return button;
}

// Create the delete button function
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
        animalIdToDelete = animalName;

        // Show the confirmation modal
        const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.show();
    });

    return button;
}

// Confirm the delete operation
async function confirmDeleteAnimal(animalName) {
    if (!animalName) return;

    try {
        await deleteAnimal(animalName); // Call the delete function
        const response = await getAnimalsWithDelay(currentPage, perPage);
        if (!response) {
            manageNoServiceMessage(true);
            manageLoadingMessage(false);
            return;
        }
        animalsArray = response;
        perPage = response.pagination.perPage;
        currentPage = response.pagination.page;
        // Remove the row from the table after successful deletion
        const tableBody = document.querySelector('#animals-list tbody');
        tableBody.innerHTML = '';
        checkIfListIsEmpty(false);
        populateAnimalTable(getCurrentPageAnimals());
    } catch (error) {
        console.error("Error deleting animal:", error);
        alert("Failed to delete animal. Please try again.");
    }
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
        const deleteButton = createDeleteButton(animal.name); // Pass the animal ID to the delete button
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

// Function to show and hide the loading message when fetch animals
function manageLoadingMessage(isLoading) {
    const loadingMessageBox = document.getElementById('loading-message-box');
    if (isLoading) {
        loadingMessageBox.classList.remove('d-none');
    } else {
        loadingMessageBox.classList.add('d-none');
    }
}
// Function to show and hide the loading message when manage the pagination
function manageLoadingPagination(isLoading) {
    const loadingPaginationBox = document.getElementById('loading-pagination-box');
    if (isLoading) {
        loadingPaginationBox.classList.remove('d-none');
    } else {
        loadingPaginationBox.classList.add('d-none');
    }
}
// Function to show and hide the no service message
function manageNoServiceMessage(isLoading) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    if (isLoading) {
        noServiceMessageBox.classList.remove('d-none');
    } else {
        noServiceMessageBox.classList.add('d-none');
    }
}

// Function to simulate a delay in fetching data
async function getAnimalsWithDelay(page, perPage) {
    try {
        const response = await getAnimalPage(page, perPage); // Modify to getAnimalPage
        return response;
    } catch (error) {
        console.error('Error getting animals:', error);
        return null;
    }
}

// Function to get the current page animals.
function getCurrentPageAnimals() {
    if (!animalsArray || !animalsArray.records) return [];
    return animalsArray.records;
}
function list() {
    const div = document.createElement('div');
    div.innerHTML = `
    <!-- No service message box -->
    <div id="no-service-message-box" class="d-none">
        <p>There is no service available. Please try again later.</p>
    </div>
    <!-- loading message box -->
    <div id="loading-message-box" class="d-none">
        <p>Loading animals...</p>
    </div>
    <!-- loading pagination box -->
    <div id="loading-pagination-box" class="d-none">
        <p>Loading page...</p>
    </div>
    <!-- Error message box -->
    <div id="error-message-box" class="d-none">
        <p>Error loading animals. Please try again later.</p>
    </div>
    <!-- Message box -->
    <div id="message-box" class="d-none">
        <p>There is no animals available. Please add one.</p>
    </div>
    <!-- Main container -->
    <div class="container">
        <!-- Animal table -->
        <table id="animals-list" class="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Breed</th>
                    <th scope="col">Eyes</th>
                    <th scope="col">Legs</th>
                    <th scope="col">Sound</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div id="paginationContainer">
            <nav aria-label="Animals navigation">
                <ul id="pagination" class="pagination">
                    <li id="previousPage" class="page-item disabled">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li id="nextPage" class="page-item">
                        <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this animal?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button id="confirmDeleteButton" type="button" class="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `;
    // Add the structure to the root element.
    // show the loading message.
    manageLoadingMessage(true);
    getAnimalsWithDelay(currentPage, perPage).then((response) => { // Call getAnimalsWithDelay
        // Check if the response is null
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
    });
    return div;
}

export default list;