import { getAnimals, deleteAnimal } from './animals/animal.service.js';

// Global variables
let animalIdToDelete = null;
let currentPage = 1;
let perPage = 5;
let animalsArray = { animals: [], pagination: {} };

// Function to create the Edit button
function createEditButton(animalId) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('title', 'Edit Animal');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-pen-to-square');
    button.appendChild(icon);
    button.addEventListener('click', () => {
        window.location.href = `animal.html?id=${animalId}`;
    });
    return button;
}

// Function to manage the aria-hidden attribute
function setModalAriaHidden(modal, isHidden) {
    modal.setAttribute('aria-hidden', isHidden.toString());
}

// Function to create the Delete button
function createDeleteButton(animalId) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-danger', 'btn-sm');
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.setAttribute('data-bs-placement', 'top');
    button.setAttribute('title', 'Delete Animal');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash-alt');
    button.appendChild(icon);
    button.addEventListener('click', () => {
        animalIdToDelete = animalId;
        const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
        const modal = new bootstrap.Modal(deleteConfirmationModal);
        setModalAriaHidden(deleteConfirmationModal, false);
        modal.show();
    });
    return button;
}

// Function to populate the animal table
async function populateAnimalTable(animals) {
    console.log("populateAnimalTable called with:", animals);
    if (!animals) {
        console.log("populateAnimalTable: No animals data provided.");
        return;
    }
    manageNoServiceMessage(false);
    manageLoadingMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#animals-list tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    manageLoadingPagination(false);

    animals.forEach((animal) => {
        const row = document.createElement('tr');
        row.id = `animal-${animal.id}`;

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
        const editButton = createEditButton(animal.id);
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal.id);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });

    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    checkIfListIsEmpty(false);
}

// Function to check if the list is empty
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

// Function to get the animals for the current page
function getCurrentPageAnimals() {
    console.log("getCurrentPageAnimals called");
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    return animalsArray.animals.slice(start, end);
}

// Function to manage pagination
async function managePagination() {
    console.log("managePagination called");
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationUl = document.getElementById('pagination');
    const previousPageLi = document.getElementById('previousPage');
    const nextPageLi = document.getElementById('nextPage');

    paginationUl.querySelectorAll('.page-number').forEach(li => li.remove());

    const numberOfPages = animalsArray.pagination.pages;

    if (numberOfPages > 1) {
        paginationContainer.classList.remove('d-none');
    } else {
        paginationContainer.classList.add('d-none');
        return;
    }
    const tableBody = document.querySelector('#animals-list tbody');

    for (let i = 1; i <= numberOfPages; i++) {
        const pageNumberLi = document.createElement('li');
        pageNumberLi.classList.add('page-item', 'page-number');
        if (i === currentPage) {
            pageNumberLi.classList.add('active');
        }
        const pageNumberLink = document.createElement('a');
        pageNumberLink.classList.add('page-link');
        pageNumberLink.href = '#';
        pageNumberLink.textContent = i;

        pageNumberLink.addEventListener('click', async (event) => {
            event.preventDefault();
            manageLoadingPagination(true);
            manageNoServiceMessage(false);
            manageLoadingMessage(true);
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
            managePagination();
            populateAnimalTable(getCurrentPageAnimals());
        });

        pageNumberLi.appendChild(pageNumberLink);
        paginationUl.insertBefore(pageNumberLi, nextPageLi);
    }

    previousPageLi.classList.toggle('disabled', currentPage === 1);
    if (currentPage !== 1) {
        previousPageLi.querySelector('a').replaceWith(previousPageLi.querySelector('a').cloneNode(true));
        previousPageLi.querySelector('a').addEventListener('click', async (event) => {
            event.preventDefault();
            manageLoadingPagination(true);
            manageNoServiceMessage(false);
            manageLoadingMessage(true);
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

    nextPageLi.classList.toggle('disabled', currentPage === numberOfPages);
    if (currentPage !== numberOfPages) {
        nextPageLi.querySelector('a').replaceWith(nextPageLi.querySelector('a').cloneNode(true));
        nextPageLi.querySelector('a').addEventListener('click', async (event) => {
            event.preventDefault();
            manageLoadingPagination(true);
            manageNoServiceMessage(false);
            manageLoadingMessage(true);
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

// Function to fetch animals with a delay
async function getAnimalsWithDelay(page, perPage) {
    console.log("getAnimalsWithDelay called with:", page, perPage);
    try {
        const response = await getAnimals(page, perPage);
        console.log("getAnimalsWithDelay response:", response);
        if (response && response.records && response.pagination) {
            
            return {
                animals: response.records,
                pagination: response.pagination
            };
        }
        console.log("getAnimalsWithDelay returning empty data");
        return { animals: [], pagination: { pages: 0, page: 0, perPage: 0 } };
    } catch (error) {
        console.error('Error getting animals:', error);
        return null;
    }
}

// Function to manage the "No Service" message
function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    if (show) {
        noServiceMessageBox.classList.remove('d-none');
    } else {
        noServiceMessageBox.classList.add('d-none');
    }
}
// Function to manage the loading message
function manageLoadingMessage(isLoading) {
    const loadingMessageBox = document.getElementById('loading-message-box');
    if (loadingMessageBox) {
        if (isLoading) {
            loadingMessageBox.classList.remove('d-none');
        } else {
            loadingMessageBox.classList.add('d-none');
        }
    }
}
// Function to manage the loading message for pagination
function manageLoadingPagination(isLoading) {
    const loadingPaginationMessageBox = document.getElementById('loading-pagination-message-box');
    if (loadingPaginationMessageBox) {
        if (isLoading) {
            loadingPaginationMessageBox.classList.remove('d-none');
        } else {
            loadingPaginationMessageBox.classList.add('d-none');
        }
    }
}