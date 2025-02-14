import { getAnimals, deleteAnimal } from './animals/animal.service.js';

// Global variable to store the animalId to delete
let animalIdToDelete = null;
// Global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
const perPage = 5;
// Global variable for the array of animals
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

async function populateAnimalTable(animals) {
    manageNoServiceMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#animals-list tbody');
    manageLoadingPagination(false);

    animals.forEach((animal) => {
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
        const editButton = createEditButton(animal.id);
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(animal.id);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
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

function managePagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationUl = document.getElementById('pagination');
    const previousPageLi = document.getElementById('previousPage');
    const nextPageLi = document.getElementById('nextPage');
    paginationUl.querySelectorAll('.page-number').forEach(li => li.remove());

    if (animalsArray.length > perPage) {
        paginationContainer.classList.remove('d-none');
    } else {
        paginationContainer.classList.add('d-none');
        return;
    }

    const numberOfPages = Math.ceil(animalsArray.length / perPage);
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
        pageNumberLink.addEventListener('click', (event) => {
            event.preventDefault();
            manageLoadingPagination(true);
            manageNoServiceMessage(false);
            currentPage = i;
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
        previousPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            manageLoadingPagination(true);
            manageNoServiceMessage(false);
            currentPage--;
            tableBody.innerHTML = '';
            managePagination();
            populateAnimalTable(getCurrentPageAnimals());
        });
    }

    nextPageLi.classList.toggle('disabled', currentPage === numberOfPages);
    if (currentPage !== numberOfPages) {
        nextPageLi.querySelector('a').replaceWith(nextPageLi.querySelector('a').cloneNode(true));
        nextPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            manageLoadingPagination(true);
            manageNoServiceMessage(false);
            currentPage++;
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
            resolve(animals);
        }, API_DELAY);
    });
}

function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    const animalListTable = document.getElementById('animals-list');
    const loadingMessageBox = document.getElementById('loading-message-box');
    const messageBox = document.getElementById('message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    if (show) {
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

async function initializePage() {
    try {
        document.body.classList.add('loading');
        const paginationUl = document.getElementById('pagination');
        paginationUl.classList.add('disabled');
        checkIfListIsEmpty(true);
        const animals = await getAnimalsWithDelay();
        animalsArray = animals;
        managePagination();
        populateAnimalTable(getCurrentPageAnimals());
    } catch (error) {
        manageNoServiceMessage(true);
        console.error("Error fetching data:", error);
    } finally {
        document.body.classList.remove('loading');
    }
}

initializePage();