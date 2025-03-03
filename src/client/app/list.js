// URL for the API
import { getAnimalPage, getAnimals, deleteAnimal } from './animals/animal.service.js';

const ANIMALS_PER_PAGE = 5;
let currentPage = 1; // Initialize currentPage to 1

// DOM elements
const $animalsList = document.getElementById('animals-list');
const $animalsTbody = $animalsList.querySelector('tbody');
const $pagination = document.getElementById('pagination');
const $previousPage = document.getElementById('previousPage');
const $nextPage = document.getElementById('nextPage');
const $loadingMessageBox = document.getElementById('loading-message-box');
const $noServiceMessageBox = document.getElementById('no-service-message-box');
const $messageBox = document.getElementById('message-box');
const $errorMessage = document.getElementById('error-message-box');
const $loadingPagination = document.getElementById('loading-pagination-message-box');
const $deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
const $confirmDeleteButton = document.getElementById('confirmDeleteButton');

// Variables
let totalPages = 0;
let deleteAnimalId = null; // To store the animal ID to delete

// Functions
// Function to display the message box
function showMessageBox() {
    $messageBox.style.display = 'block';
    $animalsList.classList.add('d-none'); // Hide the table
    $pagination.parentElement.classList.add('d-none'); // Hide the pagination
    document.body.classList.remove('loading'); // Remove the loading class
}
// Function to hide the message box
function hideMessageBox() {
    $messageBox.style.display = 'none';
    $animalsList.classList.remove('d-none');
    $pagination.parentElement.classList.remove('d-none');
}
// Function to handle errors
function handleError(error) {
    $errorMessage.textContent = `Error: ${error.message}`;
    $errorMessage.classList.remove('d-none'); // Show the error message box
    $loadingMessageBox.classList.add('d-none'); // Hide the loading message box
    $loadingPagination.classList.add('d-none');
    document.body.classList.remove('loading'); // Remove the loading class
}
// Function to hide the error message box
function hideErrorMessage() {
    $errorMessage.classList.add('d-none');
}

// Function to clear the table body
function clearTableBody() {
    $animalsTbody.innerHTML = '';
}

// Function to display animals in the table
function displayAnimals(animals) {
    clearTableBody(); // Clear previous rows

    if (animals.length === 0) {
        showMessageBox();
    } else {
        hideMessageBox();
    }

    animals.forEach(animal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${animal.name}</td>
            <td>${animal.breed}</td>
            <td>${animal.eyes}</td>
            <td>${animal.legs}</td>
            <td>${animal.sound}</td>
            <td>
                <a href="animal.html?name=${animal.name}" class="btn btn-primary">Edit</a>
                <button class="btn btn-danger delete-button" data-animal-id="${animal.id}">Delete</button>
            </td>
        `;
        $animalsTbody.appendChild(row);
    });
    // Add event listeners to the delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', (event) => {
          const animalId = event.target.getAttribute('data-animal-id');
          updateDeleteConfirmationModal(animalId);
      });
    });
}
// Function to delete an animal row from the table
function deleteAnimalRow() {
  const rowToDelete = document.querySelector(`[data-animal-id="${deleteAnimalId}"]`).closest('tr');
  rowToDelete.remove();
}
// Function to update the delete confirmation modal with the correct animal ID
function updateDeleteConfirmationModal(animalId) {
  deleteAnimalId = animalId;
  $deleteConfirmationModal.show(); // Show the modal
}

// Function to update pagination links
function updatePaginationLinks() {
    $pagination.innerHTML = ''; // Clear previous links

    // Previous page button
    $previousPage.classList.toggle('disabled', currentPage === 1);

    // Page number links
    for (let i = 1; i <= totalPages; i++) {
        const $pageItem = document.createElement('li');
        $pageItem.classList.add('page-item');
        if (i === currentPage) {
            $pageItem.classList.add('active');
        }
        const $pageLink = document.createElement('a');
        $pageLink.classList.add('page-link');
        $pageLink.href = '#';
        $pageLink.textContent = i;
        $pageLink.addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = i;
            loadAnimals();
        });
        $pageItem.appendChild($pageLink);
        $pagination.appendChild($pageItem);
    }

    // Next page button
    $nextPage.classList.toggle('disabled', currentPage === totalPages);
}

// Function to load animals
async function loadAnimals() {
    //hide the error message box if necessary
    hideErrorMessage();
    //Show loading message
    if(currentPage == 1){
      $loadingMessageBox.classList.remove('d-none');
    } else {
      $loadingPagination.classList.remove('d-none');
    }
    
    try {
      //get the list of animals
      const { records, pagination } = await getAnimalPage(currentPage, ANIMALS_PER_PAGE);
      totalPages = pagination.pages;
      //update the page
      displayAnimals(records);
      updatePaginationLinks();
    } catch (error) {
      if(error.message == "Failed to fetch animals"){
        $noServiceMessageBox.classList.remove('d-none');
      } else {
        handleError(error);
      }
    } finally {
      $loadingMessageBox.classList.add('d-none');
      $loadingPagination.classList.add('d-none');
    }
}
// Event Listeners
$previousPage.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        loadAnimals();
    }
});

$nextPage.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentPage < totalPages) {
        currentPage++;
        loadAnimals();
    }
});
$confirmDeleteButton.addEventListener('click', async () => {
  $deleteConfirmationModal.hide(); // Hide the modal
  document.body.classList.add('loading'); // Show loading cursor and prevent interaction

  try {
      await deleteAnimal(deleteAnimalId); // Call the delete function
      deleteAnimalRow();
      const rowCount = $animalsTbody.querySelectorAll('tr').length;

      // Check if the current page is empty after deletion and go to previous page if necessary
      if (rowCount === 0 && currentPage > 1) {
          currentPage--;
          await loadAnimals(); // Reload animals for previous page
      } else {
          await loadAnimals();
      }

  } catch (error) {
      handleError(error); // Handle the error
  } finally {
      document.body.classList.remove('loading'); // Remove loading cursor and restore interaction
  }
});
//Change the animal link
document.querySelector('.navbar-nav .nav-link[href="animal.html"]').href="animal.html";
// Initial load
loadAnimals();