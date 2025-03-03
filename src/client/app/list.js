import animalService from './animals/animal.service.js';

// Page elements
const animalsList = document.getElementById('animals-list');
const animalsListBody = animalsList.querySelector('tbody');
const loadingMessageBox = document.getElementById('loading-message-box');
const pagination = document.getElementById('pagination');
const previousPage = document.getElementById('previousPage');
const nextPage = document.getElementById('nextPage');
const loadingPaginationMessageBox = document.getElementById('loading-pagination-message-box');
const messageBox = document.getElementById('message-box');
const errorMessage = document.getElementById('error-message-box');
const noServiceMessageBox = document.getElementById('no-service-message-box');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const loadingSpinner = document.getElementById('loading-spinner');
const paginationContainer = document.getElementById('paginationContainer');

// Pagination variables
let currentPage = 1;
let perPage = 5;
let totalPages = 0;
let isDeleting = false;
let animalToDelete = null;

async function getAnimalsWithDelay(page, perPage) {
    console.log("getAnimalsWithDelay called with:", page, perPage);
    try {
        const response = await animalService.getAnimalPage({ page, perPage });

        if (response) {
            const animals = response;
            const pagination = {
                pages: response.length > 0 ? Math.ceil(response.length/perPage): 0,
                page: page,
                perPage: perPage,
            }
            if(response.length > 0){
                return {
                    animals: animals,
                    pagination: pagination
                };
            } else {
                return { animals: [], pagination: { pages: 0, page: 0, perPage: 0 } };
            }

        } else {
            console.log("getAnimalsWithDelay returning empty data");
            return { animals: [], pagination: { pages: 0, page: 0, perPage: 0 } };
        }
    }
    catch (error){
        console.error('Error getting animals:', error);
        return null;
    }
}

function displayAnimals(animals) {
    console.log("displayAnimals called");
    if (animals && animals.length > 0) {
        // Clear existing rows
        animalsListBody.innerHTML = '';
        // Hide message boxes
        messageBox.classList.add('d-none');
        // Display the table
        animalsList.classList.remove('d-none');

        animals.forEach(animal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${animal.name}</td>
                <td>${animal.breed}</td>
                <td>${animal.eyes}</td>
                <td>${animal.legs}</td>
                <td>${animal.sound}</td>
                <td>
                    <a href="animal.html?id=${animal.name}" class="btn btn-primary btn-sm edit-button">Edit</a>
                    <button class="btn btn-danger btn-sm delete-button" data-animal-id="${animal.name}">Delete</button>
                </td>
            `;
            animalsListBody.appendChild(row);
        });
        // Set up delete buttons
        setupDeleteButtons();
    } else {
        // Clear table if no animals
        animalsListBody.innerHTML = '';
        // Hide the table
        animalsList.classList.add('d-none');
        // Show message box if no animals
        messageBox.classList.remove('d-none');
    }
}

function setupDeleteButtons() {
    console.log("setupDeleteButtons called");
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const animalId = event.target.dataset.animalId;
            animalToDelete = animalId; // Set the global variable
            // Show confirmation modal
            const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
            deleteConfirmationModal.show();
        });
    });
}

function updatePagination(paginationData) {
    console.log("updatePagination called with:", paginationData);
    totalPages = paginationData.pages;
    currentPage = paginationData.page;
    perPage = paginationData.perPage;

    // Remove all existing page links
    const allPages = pagination.querySelectorAll('.page-item:not(#previousPage):not(#nextPage)');
    allPages.forEach(page => page.remove());

    // Disable/Enable Previous button
    if (currentPage === 1) {
        previousPage.classList.add('disabled');
    } else {
        previousPage.classList.remove('disabled');
    }

    // Disable/Enable Next button
    if (currentPage === totalPages) {
        nextPage.classList.add('disabled');
    } else {
        nextPage.classList.remove('disabled');
    }
    // Add new page links
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === currentPage) {
            li.classList.add('active');
        }
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pagination.insertBefore(li, nextPage);
    }

    // Add event listeners to page links
    const pageLinks = pagination.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        if (!link.parentElement.classList.contains('disabled')) {
            link.addEventListener('click', event => {
                event.preventDefault();
                const page = link.textContent;
                if (page !== 'Previous' && page !== 'Next') {
                    loadAnimals(parseInt(page));
                }
            });
        }
    });
}

async function loadAnimals(page = 1) {
    console.log("loadAnimals called with page:", page);
    loadingPaginationMessageBox.classList.remove('d-none'); // Show loading indicator
    animalsList.classList.add('d-none');//hide table
    pagination.classList.add('d-none');//hide pagination
    errorMessage.classList.add('d-none'); // Hide error message
    noServiceMessageBox.classList.add('d-none'); // Hide service message
    try {
        const { animals, pagination } = await getAnimalsWithDelay(page, perPage);
        displayAnimals(animals);
        updatePagination(pagination);
        paginationContainer.classList.remove('d-none');//show pagination
        loadingPaginationMessageBox.classList.add('d-none'); // Hide loading indicator
    } catch (error) {
        console.error('Failed to load animals:', error);
        errorMessage.classList.remove('d-none'); // Show error message
        errorMessage.textContent = 'Failed to load animals. Please try again later.'; // Set error message
        noServiceMessageBox.classList.add('d-none'); // hide no service message
        loadingPaginationMessageBox.classList.add('d-none'); // Hide loading indicator
    }
}

// Handle previous page click
previousPage.addEventListener('click', event => {
    event.preventDefault();
    if (currentPage > 1) {
        loadAnimals(currentPage - 1);
    }
});

// Handle next page click
nextPage.addEventListener('click', event => {
    event.preventDefault();
    if (currentPage < totalPages) {
        loadAnimals(currentPage + 1);
    }
});

// Handle delete
confirmDeleteButton.addEventListener('click', async () => {
    if (animalToDelete && !isDeleting) {
        isDeleting = true;
        try {
            // Show spinner
            loadingSpinner.classList.remove('d-none');
            await animalService.deleteAnimal(animalToDelete);
            // Reload animals
            await loadAnimals(currentPage);
        } catch (error) {
            console.error('Error deleting animal:', error);
        } finally {
            // Hide spinner
            loadingSpinner.classList.add('d-none');
            isDeleting = false;
        }
    }
    // Hide modal
    const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
    deleteConfirmationModal.hide();
});

// Handle timeout and no service
let timeoutId; // Define timeoutId in the outer scope

async function initialize() {
    try {
        timeoutId = setTimeout(() => {
            console.log("Timeout triggered");
            noServiceMessageBox.classList.remove('d-none'); // Show "no service" message
            loadingMessageBox.classList.add('d-none'); // Hide "loading" message
            clearTimeout(timeoutId);
        }, 5000);

        await loadAnimals();
    } catch (error) {
        console.error('Initialization failed:', error);
        // Handle the error during initialization
    } finally {
        clearTimeout(timeoutId);
        loadingMessageBox.classList.add('d-none');
        noServiceMessageBox.classList.add('d-none');
    }
}

initialize();