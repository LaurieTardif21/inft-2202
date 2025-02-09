// Name: Laurie Tardif
// Date: 02/08/2025
// Course Code: INFT 2202
// Section Number: 05
// Description: Handles fetching and displaying products with pagination

import ProductService from './product.service.js';

const perPage = 6; // Number of products per page
const TIMEOUT_DURATION = 5000; // 5 seconds
let allProducts = []; // Store all products to handle pagination
let currentPage = 1; // Track the current page
let noServiceTimeout;
// Simulate API delay for 2 seconds
const API_DELAY = 2000;
//Global variable to store the productId to delete
let productIdToDelete = null;

// Function to simulate API delay
async function getProductsWithDelay() {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const products = await ProductService.getProducts();
            resolve(products);
        }, API_DELAY);
    });
}

async function deleteProductWithDelay(productId) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                await ProductService.deleteProduct(productId);
                resolve();
            } catch (error) {
                reject(error);
            }
        }, API_DELAY);
    });
}

// Function to check if the list is empty and manage the no products message box
function checkIfListIsEmpty(isLoading) {
    const productListTable = document.getElementById('products-list');
    const messageBox = document.getElementById('message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    const tableBody = productListTable.querySelector('tbody');

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

// Function to manage the no service message box
function manageNoServiceMessage(show) {
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    const productListTable = document.getElementById('products-list');
    const loadingMessageBox = document.getElementById('loading-message-box');
    const messageBox = document.getElementById('message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    const paginationContainer = document.getElementById('paginationContainer');

    if (show) {
        // Show the no service message and hide everything else
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

// Function to manage the loading on pagination
function manageLoadingPagination(show) {
    const loadingPaginationMessage = document.getElementById('loading-pagination-message-box');
    if (show) {
        loadingPaginationMessage.classList.remove('d-none');
    } else {
        loadingPaginationMessage.classList.add('d-none');
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.getElementById("products-list").querySelector('tbody');
    const paginationContainer = document.getElementById("pagination");
    const noProductsMessage = document.getElementById("message-box");
    const loadingMessageBox = document.getElementById("loading-message-box");
    const errorMessage = document.getElementById("error-message-box");
    const noServiceMessage = document.getElementById("no-service-message-box");
    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const paginationLoading = document.getElementById('loading-pagination-message-box');
    const body = document.querySelector('body');
    const previousPage = document.getElementById('previousPage');
    const nextPage = document.getElementById('nextPage');
    const loadingSpinner = document.getElementById('loading-spinner');
    const paginationUl = document.getElementById('pagination');


    // Function to clear messages
    function clearMessages() {
        noProductsMessage.classList.add('d-none');
        loadingMessageBox.classList.add('d-none');
        errorMessage.classList.add('d-none');
        noServiceMessage.classList.add('d-none');
        paginationLoading.classList.add('d-none');
    }

    function showLoading() {
        clearMessages();
        body.classList.add('loading');
        loadingSpinner.classList.remove('d-none');
        loadingMessageBox.classList.remove('d-none');
        productList.parentElement.classList.add('d-none');
        paginationContainer.parentElement.classList.add('d-none');
    }
    function showLoadingPagination(){
        paginationLoading.classList.remove('d-none');
    }

    function hideLoading() {
        body.classList.remove('loading');
        loadingSpinner.classList.add('d-none');
        loadingMessageBox.classList.add('d-none');
        paginationLoading.classList.add('d-none');
    }

    // Function to handle errors
    function showError(message) {
        clearMessages();
        errorMessage.classList.remove('d-none');
        errorMessage.textContent = message;
    }

    // Function to fetch products
    async function fetchProducts(page = 1) {
        try {
            if (isInitialLoad) {
                showLoading();
            } else {
                manageLoadingPagination(true);
            }
            currentPage = page;
            clearTimeout(noServiceTimeout);
            // Load product from local storage
            const products = await getProductsWithDelay();
            allProducts = products; // Store all products to handle pagination
            checkIfListIsEmpty(false);

             //if the list is empty, exit the function
            if (products.length === 0) {
                return;
            }
            //if the list is not empty, continue the function
            noProductsMessage.classList.add('d-none');
            productList.parentElement.classList.remove('d-none');
            paginationContainer.parentElement.classList.remove('d-none');
            // Get the products for the current page
            const start = (page - 1) * perPage;
            const end = start + perPage;
            const paginatedProducts = allProducts.slice(start, end);

            renderProducts(paginatedProducts);
            setupPagination(Math.ceil(allProducts.length / perPage), page); // Calculate the total pages

            isInitialLoad = false; // Set to false after the first load
        } catch (error) {
            showError(error.message); // Display error message
            noServiceTimeout = setTimeout(() => {
                clearMessages();
                manageNoServiceMessage(true);// Show "No service available" message after timeout
                hideLoading();
            }, TIMEOUT_DURATION);
        } finally {
            // Always hide loading, even if an error occurred
            
        }
    }

    // Function to render products
    function renderProducts(products) {
        productList.innerHTML = ""; // Clear existing products
        products.forEach(product => {
            const row = document.createElement("tr");
            row.id = `product-${product.id}`;
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.stock}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" title="Edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm delete-btn" title="Delete" data-id="${product.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            productList.appendChild(row);
        });

        setupEditButtons();
        setupDeleteButtons();
    }

    // Function to set up delete buttons
    function setupDeleteButtons() {
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.dataset.id;
                // Show the modal
                $('#deleteConfirmationModal').modal('show');
                // set the id of the product to delete
                productIdToDelete = productId;
            });
        });
    }

    // Function to set up edit buttons
    function setupEditButtons() {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.dataset.id;
                window.location.href = `product.html?id=${productId}`;
            });
        });
    }

    async function deleteProduct(productId) {
        //disable the user interaction
        document.body.classList.add('loading');
        //disable the pagination
        paginationUl.classList.add('disabled');
        // delete the product from local storage
        try {
            await deleteProductWithDelay(productId);

             // Remove the animal in the global array
             const index = allProducts.findIndex(product => product.id === productId);
             if (index !== -1) {
                allProducts.splice(index, 1);
             }
             // Remove the row from the table
             const row = document.getElementById(`product-${productId}`);
             if (row) {
                row.remove();
             }
              // Update the empty list message if needed
              checkIfListIsEmpty(false);

            //update the pagination, if needed.
            if (allProducts.length % perPage === 1 && currentPage === Math.ceil(allProducts.length / perPage) && currentPage > 1) {
                currentPage--;
            }
            await fetchProducts(currentPage);
        } catch (error) {
            showError(error.message);
            noServiceTimeout = setTimeout(() => {
                clearMessages();
                manageNoServiceMessage(true); // Show "No service available" message after timeout
                hideLoading();
            }, TIMEOUT_DURATION);
        } finally {
            //re-enable the user interaction
            document.body.classList.remove('loading');
            //enable the pagination
            paginationUl.classList.remove('disabled');
            $('#deleteConfirmationModal').modal('hide');
        }
    }

    // Function to set up pagination
    function setupPagination(totalPages, page) {
        const paginationContainer = document.getElementById('paginationContainer');
        const paginationUl = document.getElementById('pagination');
        //get the previous and next li
        const previousPageLi = document.getElementById('previousPage');
        const nextPageLi = document.getElementById('nextPage');
        // Remove previous page link
        paginationUl.querySelectorAll('.page-number').forEach(li => li.remove());

        //check if there is more than 5 products
        if (allProducts.length > perPage) {
            paginationContainer.classList.remove('d-none');
        } else {
            paginationContainer.classList.add('d-none');
            return;
        }
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = `page-item ${i === page ? "active" : ""} page-number`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", () => {
                fetchProducts(i);
            });
            paginationContainer.appendChild(li);
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
            fetchProducts(currentPage);
        });
    }

    //Manage the next button
    nextPageLi.classList.toggle('disabled', currentPage === totalPages);
    //add the event if is not disabled
    if (currentPage !== totalPages) {
        //remove the old event
        nextPageLi.querySelector('a').replaceWith(nextPageLi.querySelector('a').cloneNode(true));
        nextPageLi.querySelector('a').addEventListener('click', (event) => {
            event.preventDefault();
            //show loading div
            manageLoadingPagination(true);
             //hide no service message
             manageNoServiceMessage(false);
            currentPage++;
            fetchProducts(currentPage);
        });
    }
    }
    previousPage.addEventListener("click", () => {
        if (currentPage > 1) {
            fetchProducts(currentPage - 1);
        }
    });
    nextPage.addEventListener("click", () => {
        if (currentPage * perPage < allProducts.length) {
            fetchProducts(currentPage + 1);
        }
    });
      async function initializePage() {
        try {
            //disable the user interaction
            document.body.classList.add('loading');
            //disable the pagination
            const paginationUl = document.getElementById('pagination');
            paginationUl.classList.add('disabled');
    
            //show that the list is loading
            checkIfListIsEmpty(true);
            await fetchProducts(currentPage);
        } catch (error) {
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
            hideLoading();
    
        }
    }

    confirmDeleteButton.addEventListener('click', async () => {
        // Check if the animalIdToDelete is defined
        //disable the user interaction
        document.body.classList.add('loading');
        //disable the pagination
        const paginationUl = document.getElementById('pagination');
        paginationUl.classList.add('disabled');
        if (productIdToDelete !== null) {
            try {
                await deleteProduct(productIdToDelete);
               
            } catch (error) {
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
                paginationUl.classList.remove('disabled');
                $('#deleteConfirmationModal').modal('hide');
            }
        }
    });
    initializePage();
});