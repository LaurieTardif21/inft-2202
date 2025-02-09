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
let isLoading = false; // Global loading state

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


    // Function to clear messages
    function clearMessages() {
        noProductsMessage.classList.add('d-none');
        loadingMessageBox.classList.add('d-none');
        errorMessage.classList.add('d-none');
        noServiceMessage.classList.add('d-none');
        paginationLoading.classList.add('d-none');
    }

    function showLoading() {
        isLoading = true; // Set the global loading state
        clearMessages();
        body.classList.add('loading');
        loadingSpinner.classList.remove('d-none');
        loadingMessageBox.classList.remove('d-none');
        productList.parentElement.classList.add('d-none');
        paginationContainer.parentElement.classList.add('d-none');
    }

     function showLoadingPagination(){
        isLoading = true; // Set the global loading state
        paginationLoading.classList.remove('d-none');
    }

    function hideLoading() {
        isLoading = false; // Reset the global loading state
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
            if (page === 1 && currentPage === 1) {
                 showLoading();
            }else{
                showLoadingPagination();
            }
            currentPage = page;
            clearTimeout(noServiceTimeout);
            // Load product from local storage
            const products = await getProductsWithDelay();
            allProducts = products; // Store all products to handle pagination

            if (products.length === 0) {
                hideLoading();
                noProductsMessage.classList.remove('d-none');
                productList.parentElement.classList.add('d-none');
                paginationContainer.parentElement.classList.add('d-none');
                return;
            }
            noProductsMessage.classList.add('d-none');
            productList.parentElement.classList.remove('d-none');
            paginationContainer.parentElement.classList.remove('d-none');
            // Get the products for the current page
            const start = (page - 1) * perPage;
            const end = start + perPage;
            const paginatedProducts = allProducts.slice(start, end);

            renderProducts(paginatedProducts);
            setupPagination(Math.ceil(allProducts.length / perPage), page); // Calculate the total pages
            hideLoading();

        } catch (error) {
            showError(error.message); // Display error message
            noServiceTimeout = setTimeout(() => {
                clearMessages();
                noServiceMessage.classList.remove('d-none'); // Show "No service available" message after timeout
                hideLoading();
            }, TIMEOUT_DURATION);
        }
    }

    // Function to render products
    function renderProducts(products) {
        productList.innerHTML = ""; // Clear existing products
        products.forEach(product => {
            const row = document.createElement("tr");
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

                // Handle the confirm delete button
                confirmDeleteButton.onclick = () => {
                    deleteProduct(productId);
                };
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
        if (isLoading) return; //prevent duplicate request
        showLoading();// show the loading when we delete a product
        // delete the product from local storage
        try {
            await deleteProductWithDelay(productId);

            //update the pagination, if needed.
            if (allProducts.length % perPage === 1 && currentPage === Math.ceil(allProducts.length / perPage) && currentPage > 1) {
                currentPage--;
            }
            await fetchProducts(currentPage);
            hideLoading();
        } catch (error) {
            showError(error.message);
            noServiceTimeout = setTimeout(() => {
                clearMessages();
                noServiceMessage.classList.remove('d-none'); // Show "No service available" message after timeout
                hideLoading();
            }, TIMEOUT_DURATION);
        }
        $('#deleteConfirmationModal').modal('hide');
    }

    // Function to set up pagination
    function setupPagination(totalPages, page) {
        paginationContainer.innerHTML = "";
        previousPage.classList.remove("disabled");
        nextPage.classList.remove("disabled");

        if (page === 1) {
            previousPage.classList.add("disabled");
        }
        if (page === totalPages) {
            nextPage.classList.add("disabled");
        }

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = `page-item ${i === page ? "active" : ""}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", () => {
                fetchProducts(i);
            });
            paginationContainer.appendChild(li);
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
    fetchProducts(currentPage);
});