import { getAnimalPage, deleteAnimal } from './animals/animal.service.js';

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const animalList = document.getElementById('animals-list').querySelector('tbody');
    const paginationContainer = document.getElementById('paginationContainer');
    const pagination = document.getElementById('pagination');
    const previousPage = document.getElementById('previousPage');
    const nextPage = document.getElementById('nextPage');
    const loadingMessageBox = document.getElementById('loading-message-box');
    const loadingPaginationMessageBox = document.getElementById('loading-pagination-message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    const noServiceMessagebox = document.getElementById('no-service-message-box');
    const messageBox = document.getElementById('message-box');
    const table = document.getElementById('animals-list');
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');

    // Pagination variables
    let currentPage = 1;
    const perPage = 5;
    let totalPages = 0;

    // Error handler helper function
    function handleFetchError(error) {
        console.error('Error fetching or displaying animals:', error);
        noServiceMessagebox.classList.remove('d-none');
        loadingMessageBox.classList.add('d-none');
        loadingPaginationMessageBox.classList.add('d-none');
    }
    // Error message helper function
    function displayErrorMessage(message) {
        errorMessagebox.classList.remove('d-none');
        errorMessagebox.textContent = message;
    }

    // Show or hide loading message
    function showLoadingMessage(loading) {
        loadingMessageBox.classList.toggle('d-none', !loading);
    }
    //Show or hide pagination loading message
    function showPaginationLoadingMessage(loading) {
        loadingPaginationMessageBox.classList.toggle('d-none', !loading);
    }
    // Show or hide pagination container
    function showPaginationContainer(show) {
        paginationContainer.classList.toggle('d-none', !show);
    }

    // Render animal list
    function renderAnimalList(animals) {
        animalList.innerHTML = '';
        if (animals.length === 0) {
            messageBox.classList.remove('d-none');
            table.classList.add('d-none'); // Hide the table
            showPaginationContainer(false);
        } else {
            messageBox.classList.add('d-none');
            table.classList.remove('d-none'); // Show the table
            showPaginationContainer(true);
            animals.forEach(animal => {
                const row = animalList.insertRow();
                row.innerHTML = `
            <td>${animal.name}</td>
            <td>${animal.breed}</td>
            <td>${animal.eyes}</td>
            <td>${animal.legs}</td>
            <td>${animal.sound}</td>
            <td>
            <a href="animal.html?name=${animal.name}" class="edit-animal">
            <i class="fa-solid fa-pen-to-square fa-lg"></i>
            </a>
            <a href="#" class="delete-animal" data-animal-id="${animal.id}">
            <i class="fa-solid fa-trash fa-lg"></i>
            </a>
            </td>
            `;
            });
        }
    }

    // Render pagination links
    function renderPaginationLinks() {
        pagination.innerHTML = ''; // Clear existing links
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.classList.add('page-item');
                if (i === currentPage) {
                    li.classList.add('active');
                    li.setAttribute('aria-current', 'page');
                }
                const link = document.createElement('a');
                link.classList.add('page-link');
                link.href = '#';
                link.textContent = i;
                link.addEventListener('click', () => handlePageChange(i));
                li.appendChild(link);
                pagination.appendChild(li);
            }
        }
        // Update Previous/Next button states
        previousPage.classList.toggle('disabled', currentPage === 1);
        nextPage.classList.toggle('disabled', currentPage === totalPages);
    }

    // Handle page change
    function handlePageChange(newPage) {
        if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            fetchAnimals(); // Fetch animals for the new page
        }
    }
    // Handle Previous button click
    previousPage.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    });

    // Handle Next button click
    nextPage.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    });
    // Fetch animals from API
    async function fetchAnimals() {
        try {
            errorMessagebox.classList.add('d-none');
            showLoadingMessage(true);
            if (currentPage > 1) {
                showPaginationLoadingMessage(true);
            }
            const { records, pagination } = await getAnimalPage(currentPage, perPage);
            totalPages = pagination.pages;
            renderAnimalList(records);
            renderPaginationLinks();
        } catch (error) {
            handleFetchError(error);
            displayErrorMessage(error.message);
        } finally {
            showLoadingMessage(false);
            showPaginationLoadingMessage(false);
        }
    }

    // Call fetchAnimals to load the first page
    fetchAnimals();

    // Delete handler
    let animalToDeleteId = null;

    // Show the modal when clicking on a delete link
    animalList.addEventListener('click', (event) => {
        if (event.target.closest('.delete-animal')) {
            event.preventDefault(); // Prevent default link behavior
            const deleteLink = event.target.closest('.delete-animal'); // Get the delete link
            animalToDeleteId = deleteLink.dataset.animalId; // Save the animal ID
            deleteConfirmationModal.show(); // Show the modal
        }
    });

    // Delete animal
    confirmDeleteButton.addEventListener('click', async () => {
        try {
            await deleteAnimal(animalToDeleteId); // Delete the animal
            fetchAnimals(); // Refresh the animal list
        } catch (error) {
            displayErrorMessage('Error deleting animal.');
        } finally {
            deleteConfirmationModal.hide(); // Hide the modal
        }
    });
});