// Author: Laurie Tardif
// Date: 02/09/2025
// Filename: list.js
// Course: INFT 2202
// Description: Handles product listing, pagination, and interactions like deletion and cart addition.

import { getProducts, deleteProduct } from './product.service.js';

// DOM Elements
const productsList = document.getElementById('products-list');
const messageBox = document.getElementById('message-box');
const loadingMessageBox = document.getElementById('loading-message-box');
const errorMessage = document.getElementById('error-message-box');
const noServiceMessage = document.getElementById('no-service-message-box');
const loadingPaginationMessageBox = document.getElementById('loading-pagination-message-box');

const pagination = document.getElementById('pagination');
const previousPage = document.getElementById('previousPage');
const nextPage = document.getElementById('nextPage');
const paginationContainer = document.getElementById('paginationContainer');

let currentPage = 1;
const productsPerPage = 8;

// Displays a general message and hides product list
function showMessageBox(message) {
    messageBox.textContent = message;
    messageBox.classList.remove('d-none');
    productsList.classList.add('d-none');
}

// Shows a loading message while fetching products
function showLoadingMessage() {
    loadingMessageBox.classList.remove('d-none');
    productsList.classList.add('d-none');
}

// Hides all message boxes
function hideMessages() {
    messageBox.classList.add('d-none');
    loadingMessageBox.classList.add('d-none');
    errorMessage.classList.add('d-none');
    noServiceMessage.classList.add('d-none');
    loadingPaginationMessageBox.classList.add('d-none');
}

// Displays an error message
function displayError(error) {
    hideMessages();
    errorMessage.textContent = error;
    errorMessage.classList.remove('d-none');
}

// Displays a message when no service is available
function displayNoService() {
    hideMessages();
    noServiceMessage.classList.remove('d-none');
}

// Shows a loading message for pagination updates
function showLoadingPagination() {
    hideMessages();
    loadingPaginationMessageBox.classList.remove('d-none');
    paginationContainer.classList.add('d-none');
}

// Creates a product card dynamically
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    // Product Image
    const img = document.createElement('img');
    img.src = 'https://via.placeholder.com/300x200?text=Product';
    img.classList.add('card-img-top');
    img.alt = product.name;
    card.appendChild(img);

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Product Details
    cardBody.innerHTML = `
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">Description: ${product.description}</p>
        <p class="card-text">Stock: ${product.stock}</p>
        <p class="card-text">Price: $${product.price.toFixed(2)}</p>
    `;

    // Buttons for actions
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('gap-2');

    // Edit Button
    const editButton = document.createElement('a');
    editButton.href = `product.html?id=${product.id}`;
    editButton.classList.add('btn', 'btn-primary');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    buttonsContainer.appendChild(editButton);

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener('click', () => openDeleteModal(product.id));
    buttonsContainer.appendChild(deleteButton);

    // Add to Cart Button
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('btn', 'btn-success');
    addToCartButton.innerHTML = '<i class="fas fa-cart-plus"></i>';
    buttonsContainer.appendChild(addToCartButton);

    cardBody.appendChild(buttonsContainer);
    card.appendChild(cardBody);
    return card;
}

// Opens a modal for confirming product deletion
function openDeleteModal(productId) {
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');

    confirmDeleteButton.onclick = async () => {
        try {
            await deleteProduct(productId);
            deleteConfirmationModal.hide();
            loadProducts(currentPage);
        } catch (error) {
            displayError(`Failed to delete product: ${error.message}`);
        }
    };
    deleteConfirmationModal.show();
}

// Updates pagination controls
function updatePagination(totalPages, currentPage) {
    pagination.innerHTML = '';
    
    // Creates and appends pagination buttons dynamically
    // Handles previous, next, and individual page clicks
    
    prevLi.classList.toggle('disabled', currentPage === 1);
    nextLi.classList.toggle('disabled', currentPage === totalPages);
}

// Fetches and displays products with pagination
async function loadProducts(page) {
    showLoadingMessage();
    showLoadingPagination();
    try {
        const response = await getProducts();
        
        if (response) {
            const startIndex = (page - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const paginatedProducts = response.slice(startIndex, endIndex);

            if (response.length === 0) {
                showMessageBox('No products in the list. Add some products!');
                paginationContainer.classList.add('d-none');
            } else {
                hideMessages();
                productsList.innerHTML = '';
                paginatedProducts.forEach(product => {
                    productsList.appendChild(createProductCard(product));
                });
                productsList.classList.remove('d-none');
                enableTooltips();
                updatePagination(Math.ceil(response.length / productsPerPage), page);
            }
        } else {
            displayNoService();
        }
    } catch (error) {
        displayError(`Error loading products: ${error.message}`);
    }
}

// Enables Bootstrap tooltips on dynamically added elements
function enableTooltips() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
}

// Initial load of products
loadProducts(currentPage);
