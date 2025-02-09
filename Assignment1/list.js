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
let isInitialLoad = true; // Flag to check if it's the initial load

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
              showLoadingPagination();
            }
            currentPage = page;
            clearTimeout(noServiceTimeout);
            // Load product from local storage
            const products = await getProductsWithDelay();
            allProducts = products; // Store all products to handle pagination
            checkIfListIsEmpty(false);
    
            // if the list is empty, exit the function
            if (products.length === 0) {
              hideLoading();
              return;
            }
            // if the list is not empty, continue the function
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
            hideLoading();
          } catch (error) {
            showError(error.message); // Display error message
            noServiceTimeout = setTimeout(() => {
              clearMessages();
              manageNoServiceMessage(true); // Show "No service available" message after timeout
              hideLoading();
            }, TIMEOUT_DURATION);
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
             //refresh the list
             fetchProducts(currentPage);
        } catch(error){
            showError(error.message);
        } finally {
            document.body.classList.remove('loading');
            paginationUl.classList.remove('disabled');
        }
    }
     // Initial fetch on load
     fetchProducts();
});