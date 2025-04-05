import { getAnimals, deleteAnimal } from './animals/animal.service.js';
export { loadAnimals };

// Global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
let perPage = 5;
// Global variable for the array of animals
let animalsArray = [];

// Function to navigate between pages
let navigateTo = null;

// Helper function to manage loading state of pagination
function manageLoadingPagination(isLoading) {
    const loadingPagination = document.getElementById('loading-pagination');
    const paginationContainer = document.getElementById('paginationContainer');
    if (isLoading) {
        loadingPagination.classList.remove('d-none');
        paginationContainer.classList.add('d-none');
    } else {
        loadingPagination.classList.add('d-none');
        paginationContainer.classList.remove('d-none');
    }
}
// Helper function to manage loading state of message
function manageLoadingMessage(isLoading) {
    const loadingMessage = document.getElementById('loading-message');
    if (isLoading) {
        loadingMessage.classList.remove('d-none');
    } else {
        loadingMessage.classList.add('d-none');
    }
}
// Helper function to manage no service state of message
function manageNoServiceMessage(isNoService) {
    const noServiceMessage = document.getElementById('no-service-message');
    if (isNoService) {
        noServiceMessage.classList.remove('d-none');
    } else {
        noServiceMessage.classList.add('d-none');
    }
}
// Delay the response to show the loading message
async function getAnimalsWithDelay(currentPage, perPage) {
    manageLoadingMessage(true);
    try {
        const animals = await getAnimals(currentPage, perPage);
        await new Promise(resolve => setTimeout(resolve, 1000));
        manageLoadingMessage(false);
        return animals;
    } catch (e) {
        console.log(e);
        return null;
    }
}
// Helper function to get the animals for the current page
function getCurrentPageAnimals() {
    if (!animalsArray || !animalsArray.animals) {
        return [];
    }
    return animalsArray.animals;
}
function createEditButton(animal, navigateTo) {
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
        // Use navigateTo to update the URL and load the content
        navigateTo(`/animal?name=${encodeURIComponent(animal.name)}`);
    });
    return button;
}

// Create the delete button function
function createDeleteButton(animalId, confirmDeleteAnimal) {
    let animalIdToDelete = null;
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
        // Set the animal ID to delete in the local variable
        animalIdToDelete = animalId;

        // Show the confirmation modal
        const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.show();

        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        // Remove any existing event listener before adding a new one
        const newConfirmDeleteButton = confirmDeleteButton.cloneNode(true);
        confirmDeleteButton.parentNode.replaceChild(newConfirmDeleteButton, confirmDeleteButton);

        newConfirmDeleteButton.addEventListener('click', async () => {
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
        // Check if the list is empty and update UI
        checkIfListIsEmpty(false);
    } catch (error) {
        console.error("Error deleting animal:", error);
        alert("Failed to delete animal. Please try again.");
    }
}
// Populate the table with the animals
async function populateAnimalTable(animals, navigateTo) {
    if (!animals) {
        //do something
        return;
    }
    manageNoServiceMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#animals-list tbody');
    manageLoadingPagination(false);
    tableBody.innerHTML = ''; //clear the table before

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
        const editButton = createEditButton(animal, navigateTo); // Pass the animal ID to the edit button
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal.id, confirmDeleteAnimal); // Pass the animal ID to the delete button
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
async function managePagination(navigateTo) {
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
            currentPage = i;
            await loadAnimals(navigateTo);
        });

        //add the link to the li
        pageNumberLi.appendChild(pageNumberLink);
        //add the li to the ul
        paginationUl.insertBefore(pageNumberLi, nextPageLi);
    }
    previousPageLi.classList.toggle('disabled', currentPage === 1);
    nextPageLi.classList.toggle('disabled', currentPage === numberOfPages);
}
async function loadAnimals(navigateTo) {
    manageLoadingPagination(true);
    animalsArray = await getAnimalsWithDelay(currentPage, perPage);
    if (animalsArray === null || animalsArray.animals.length === 0) {
        manageNoServiceMessage(true);
        return;
    }
    await populateAnimalTable(getCurrentPageAnimals(), navigateTo);
    await managePagination(navigateTo);
}
//add the event listener to the previous page button
document.getElementById('previousPage').addEventListener('click', async (event) => {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        await loadAnimals(navigateTo);
    }
});
//add the event listener to the next page button
document.getElementById('nextPage').addEventListener('click', async (event) => {
    event.preventDefault();
    if (animalsArray && currentPage < animalsArray.pagination.pages) {
        currentPage++;
        await loadAnimals(navigateTo);
    }
});
export function list(nav) {
    navigateTo = nav;

    const div = document.createElement('div');
    div.innerHTML = `
        <div class="row">
            <div class="col-12">
                <h2 class="text-center">Animals</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div id="loading-message" class="d-none text-center mt-3">
                    <p>Loading animals...</p>
                </div>
                <div id="no-service-message" class="d-none text-center mt-3">
                    <p>No service available</p>
                </div>
                <div id="error-message-box" class="d-none text-center mt-3">
                    <p>Error!</p>
                </div>
                <div id="message-box" class="text-center mt-3">
                    <p>There are currently no animals</p>
                </div>
                <div id="animal-list-container">
                <table id="animals-list" class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Breed</th>
                            <th>Eyes</th>
                            <th>Legs</th>
                            <th>Sound</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
                 </div>
                 <div id="deleteConfirmationModal" class="modal fade" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>Are you sure you want to delete this animal?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger" id="confirmDeleteButton">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="loading-pagination" class="d-none text-center mt-3">
                   <p>Loading pagination...</p>
                </div>
                <nav id="paginationContainer" class="d-none mt-3" aria-label="Page navigation">
                    <ul id="pagination" class="pagination justify-content-center">
                        <li id="previousPage" class="page-item disabled">
                            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                        </li>
                        <li id="nextPage" class="page-item">
                            <a class="page-link" href="#">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    `;
    return div;
}
document.addEventListener('DOMContentLoaded', async () => {
    await loadAnimals(navigateTo);
});