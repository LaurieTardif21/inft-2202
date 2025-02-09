import { getProducts, deleteProduct } from './product.service.js';

// Global variable to store the productId to delete
let productIdToDelete = null;
// global variable for the current page
let currentPage = 1;
// Global variable for the number of entries per page
const perPage = 5;
// Global varible for the array of products
let productsArray = [];
// Simulate API delay for 2 seconds
const API_DELAY = 2000;

function createEditButton(productId) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
    button.setAttribute('data-bs-toggle', 'tooltip'); // Enable tooltip
    button.setAttribute('data-bs-placement', 'top'); // Set tooltip placement
    button.setAttribute('title', 'Edit Product'); // Set tooltip text
    // Add icon
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-pen-to-square'); // Edit icon
    button.appendChild(icon);
    button.addEventListener('click', () => {
        // Redirect to product.html with the productId as a query parameter
        window.location.href = `product.html?id=${productId}`;
    });
    return button;
}

function createDeleteButton(productId) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-danger', 'btn-sm');
    button.setAttribute('data-bs-toggle', 'tooltip'); // Enable tooltip
    button.setAttribute('data-bs-placement', 'top'); // Set tooltip placement
    button.setAttribute('title', 'Delete Product'); // Set tooltip text
    // Add icon
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash-alt'); // Delete icon
    button.appendChild(icon);
    button.addEventListener('click', () => {
        // Set the product ID to delete in the global variable
        productlIdToDelete = productId;
        // Show the confirmation modal
        const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
        deleteConfirmationModal.show();
    });
    return button;
}

async function populateProductTable(products) {
    manageNoServiceMessage(false);
    await new Promise(resolve => setTimeout(resolve, 0));
    const tableBody = document.querySelector('#products-list tbody');
    manageLoadingPagination(false);

    products.forEach((product) => {
        // ... other code to create the row
        const row = document.createElement('tr');
        row.id = `product-${product.id}`; // Assign an ID to the row for easy removal later

        const nameCell = document.createElement('td');
        nameCell.textContent = product.name; // Accessing the 'productName' property
        row.appendChild(nameCell);

        const descriptionCell = document.createElement('td');
        breedCell.textContent = product.description; // Accessing the 'productDescription' property
        row.appendChild(descriptionCell);

        const stockCell = document.createElement('td');
        stockCell.textContent = product.stock; // Accessing the 'productStock' property
        row.appendChild(stockCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = product.price; // Accessing the 'productPrice' property
        row.appendChild(priceCell);

        const actionsCell = document.createElement('td');
        const editButton = createEditButton(product.id); // Pass the product ID to the edit button
        actionsCell.appendChild(editButton);
        const deleteButton = createDeleteButton(product.id); // Pass the product ID to the delete button
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
    const tableBody = document.querySelector('#products-list tbody');
    const messageBox = document.getElementById('message-box');
    const productListTable = document.getElementById('products-list');
    const errorMessagebox = document.getElementById('error-message-box');
    if (isLoading) {
        messageBox.classList.add('d-none');
    } else {
        if (tableBody.children.length === 0) {
            if (errorMessagebox.classList.contains('d-none')) {
                productListTable.classList.add('d-none');
                messageBox.classList.remove('d-none');
            }
            
        } else {
            productListTable.classList.remove('d-none');
            messageBox.classList.add('d-none');
        }
    }
}
// Function to create and manage the pagination
function managePagination() {
    // Get the container and the ul
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationUl = document.getElementById('pagination');
    //get the previous and next li
    const previousPageLi = document.getElementById('previousPage');
    const nextPageLi = document.getElementById('nextPage');
    // Remove previous page link
    paginationUl.querySelectorAll('.page-number').forEach(li => li.remove());

    //check if there is more than 5 products
    if (productsArray.length > perPage) {
        paginationContainer.classList.remove('d-none');
    } else {
        paginationContainer.classList.add('d-none');
        return;
    }
    // Calculate the number of pages
    const numberOfPages = Math.ceil(productsArray.length / perPage);
    const tableBody = document.querySelector('#products-list tbody');

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
        pageNumberLink.addEventListener('click', (event) => {
            event.preventDefault();
            //show loading div
            manageLoadingPagination(true);
             //hide no service message
             manageNoServiceMessage(false);
            currentPage = i;
            tableBody.innerHTML = '';
            managePagination(); // Update the pagination
            populateProductTable(getCurrentPageProducts());
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
        previousPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            //show loading div
            manageLoadingPagination(true);
             //hide no service message
             manageNoServiceMessage(false);
            currentPage--;
            tableBody.innerHTML = '';
            managePagination();
            populateProductTable(getCurrentPageProducts());
        });
    }

    //Manage the next button
    nextPageLi.classList.toggle('disabled', currentPage === numberOfPages);
    //add the event if is not disabled
    if (currentPage !== numberOfPages) {
        //remove the old event
        nextPageLi.querySelector('a').replaceWith(nextPageLi.querySelector('a').cloneNode(true));
        nextPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            //show loading div
            manageLoadingPagination(true);
             //hide no service message
             manageNoServiceMessage(false);
            currentPage++;
            tableBody.innerHTML = '';
            managePagination();
            populateProductTable(getCurrentPageProducts());
        });
    }
}
async function getProductsWithDelay() {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const products = await getProducts();
            resolve(products)
        }, API_DELAY);
    })
}

function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    const productListTable = document.getElementById('products-list');
    const loadingMessageBox = document.getElementById('loading-message-box');
    const messageBox = document.getElementById('message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    if (show) {
        //show the no service message and hide everything else
        noServiceMessageBox.classList.remove('d-none');
        productListTable.classList.add('d-none');
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
        //disable the user interaction
        document.body.classList.add('loading');
        //disable the pagination
        const paginationUl = document.getElementById('pagination');
        paginationUl.classList.add('disabled');

        //show that the list is loading
        checkIfListIsEmpty(true);
        const products = await getProductsWithDelay();
        productsArray = products;
        managePagination();
        populateProductTable(getCurrentPageProducts());
    } catch (error) {
        console.error('Error fetching products:', error);
        // Show error message
        const errorMessagebox = document.getElementById('error-message-box');
        if (errorMessagebox) {
            errorMessagebox.textContent = "Error fetching products, please try again later";
            errorMessagebox.classList.remove('d-none');
        }
          // Show "no service" message if everything fails
        manageNoServiceMessage(true);
    } finally {
        //re-enable the user interaction
        document.body.classList.remove('loading');
        //enable the pagination
        const paginationUl = document.getElementById('pagination');
        paginationUl.classList.remove('disabled');
        // Hide loading message
        const loadingMessageBox = document.getElementById('loading-message-box');
        if (loadingMessageBox) {
            loadingMessageBox.classList.add('d-none');
        }

    }
}
// Function to get the products for the current page
function getCurrentPageProducts() {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return productsArray.slice(startIndex, endIndex);
}
// Attach the event listener to the confirmDeleteButton when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading message
    const loadingMessageBox = document.getElementById('loading-message-box');
    if (loadingMessageBox) {
        loadingMessageBox.classList.remove('d-none');
    }
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.addEventListener('click', async () => {
        // Check if the productIdToDelete is defined
        //disable the user interaction
        document.body.classList.add('loading');
        //disable the pagination
        const paginationUl = document.getElementById('pagination');
        paginationUl.classList.add('disabled');
        if (productIdToDelete !== null) {
            try {
                await deleteProduct(productIdToDelete);
                // Remove the product in the global array
                const index = productsArray.findIndex(product => product.id === productIdToDelete);
                if (index !== -1) {
                    productsArray.splice(index, 1);
                }
                // Remove the row from the table
                const row = document.getElementById(`product-${productIdToDelete}`);
                row.remove();
                // Update the empty list message if needed
                checkIfListIsEmpty(false);
                // Update the pagination
                managePagination();
                // Update the table
                populateProductTable(getCurrentPageProducts());
                // Close the modal
                const deleteConfirmationModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmationModal'));
                deleteConfirmationModal.hide();
            } catch (error) {
                console.error('Error deleting product:', error);
                // Show error message
                const errorMessagebox = document.getElementById('error-message-box');
                if (errorMessagebox) {
                    errorMessagebox.textContent = "Error deleting the product, please try again later";
                    errorMessagebox.classList.remove('d-none');
                }
            } finally {
                //re-enable the user interaction
                document.body.classList.remove('loading');
                //enable the pagination
                const paginationUl = document.getElementById('pagination');
                paginationUl.classList.remove('disabled');
              
            }
        }
    });
    initializePage();
});











