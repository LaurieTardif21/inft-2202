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
    const previousPage = document.getElementById('previousPage');
    const nextPage = document.getElementById('nextPage');
    let isLoading = false;// global loading state

    // Function to clear messages
    function clearMessages() {
        noProductsMessage.classList.add('d-none');
        loadingMessageBox.classList.add('d-none');
        errorMessage.classList.add('d-none');
        noServiceMessage.classList.add('d-none');
        paginationLoading.classList.add('d-none');
    }
    function manageNoServiceMessage(show) {
        const noServiceMessageBox = document.getElementById('no-service-message-box');
        const productListTable = document.getElementById('products-list');
        const loadingMessageBox = document.getElementById('loading-message-box');
        const messageBox = document.getElementById('message-box');
        const errorMessagebox = document.getElementById('error-message-box');
        const paginationContainer = document.getElementById('paginationContainer');
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
    function showLoading() {
        clearMessages();
        document.body.classList.add('loading'); // Add the class loading to the body.
        loadingMessageBox.classList.remove('d-none');
        productList.parentElement.classList.add('d-none');
        paginationContainer.parentElement.classList.add('d-none');
    }
    function showLoadingPagination() {
        paginationLoading.classList.remove('d-none');
    }

    function hideLoading() {
        document.body.classList.remove('loading');// remove the class loading.
        loadingMessageBox.classList.add('d-none');
    }

     function hideLoadingPagination(){
        paginationLoading.classList.add('d-none');
    }

    // Function to handle errors
    function showError(message) {
        clearMessages();
        errorMessage.classList.remove('d-none');
        errorMessage.textContent = message;
    }
    function checkIfListIsEmpty(isLoading) {
        const productList = document.getElementById("products-list").querySelector('tbody');
        const noProductsMessage = document.getElementById("message-box");
        const productListTable = document.getElementById('products-list');
        if (isLoading) {
            noProductsMessage.classList.add('d-none');
        } else {
            if (productList.children.length === 0) {
                productListTable.classList.add('d-none');
                noProductsMessage.classList.remove('d-none');
            } else {
                productListTable.classList.remove('d-none');
                noProductsMessage.classList.add('d-none');
            }
        }
    }

    // Function to fetch products
    async function fetchProducts(page = 1) {
        try {
            showLoading();
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
            checkIfListIsEmpty(false);

        } catch (error) {
            showError(error.message); // Display error message
            manageNoServiceMessage(true);
        } finally {
            // Always hide loading, even if an error occurred
            hideLoading();
        }
    }

    // Function to render products
    async function renderProducts(products) {
        productList.innerHTML = ""; // Clear existing products
        await new Promise(resolve => setTimeout(resolve, 0));
        products.forEach(product => {
            console.log('renderProduct product.id:', product.id);
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
                console.log("setupDeleteButtons productId:", productId); // Check ID here
                // Show the modal
                $('#deleteConfirmationModal').modal('show');

                // Handle the confirm delete button
                confirmDeleteButton.onclick = () => {
                    console.log("confirmDeleteButton productId:", productId);// Check ID here
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
         showLoading();// show the loading when we delete a product
        // delete the product from local storage
        try {
            await deleteProductWithDelay(productId);
            console.log("product deleted in ProductService");

            //update the pagination, if needed.
            if (allProducts.length % perPage === 1 && currentPage === Math.ceil(allProducts.length / perPage) && currentPage > 1) {
                currentPage--;
            }
            await fetchProducts(currentPage);
            console.log("page reload after delete");
        } catch (error) {
            showError(error.message);
             manageNoServiceMessage(true);
        }finally {
            hideLoading();// hide the loading when the operation end
        }
        $('#deleteConfirmationModal').modal('hide');
    }

    // Function to set up pagination
    function setupPagination(totalPages, page) {
        paginationLoading.classList.remove('d-none');
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
                showLoadingPagination();
                 manageNoServiceMessage(false);
                fetchProducts(i);
                 hideLoadingPagination();
            });
            paginationContainer.appendChild(li);
        }
       
    }
    previousPage.addEventListener("click", () => {
        if (currentPage > 1) {
            showLoadingPagination();
             manageNoServiceMessage(false);
            fetchProducts(currentPage - 1);
            hideLoadingPagination();
        }
    });
    nextPage.addEventListener("click", () => {
        if (currentPage * perPage < allProducts.length) {
            showLoadingPagination();
             manageNoServiceMessage(false);
            fetchProducts(currentPage + 1);
             hideLoadingPagination();
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
    initializePage();

        confirmDeleteButton.addEventListener('click', async () => {
        // Check if the animalIdToDelete is defined
        if (!isLoading) {
            try {
                isLoading = true;// prevent duplicate click
                await deleteProduct();

            } catch (error) {
                console.error('Error deleting animal:', error);
                // Show error message
                const errorMessagebox = document.getElementById('error-message-box');
                if (errorMessagebox) {
                    errorMessagebox.textContent = "Error deleting the animal, please try again later";
                    errorMessagebox.classList.remove('d-none');
                }
            } finally {
                isLoading = false;// enable the click
            }
        }
    });
});