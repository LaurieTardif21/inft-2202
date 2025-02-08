// list.js
import { deleteProduct, getAllProducts } from './product.service.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const productsTableBody = document.querySelector('#products-list tbody');
    const messageBox = document.getElementById('message-box');
    const loadingMessageBox = document.getElementById('loading-message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    const noServiceMessageBox = document.getElementById('no-service-message-box');
    const paginationContainer = document.getElementById('paginationContainer');
    const loadingPaginationMessage = document.getElementById('loading-pagination-message-box');
    const loadingSpinner = document.getElementById('loading-spinner');
    const productsTable = document.getElementById('products-list');
    const previousPageButton = document.getElementById('previousPage');
    const nextPageButton = document.getElementById('nextPage');
    const pagination = document.getElementById('pagination');

    let currentPage = 1; // Current page number
    const perPage = 6;   // Number of products per page

    // Function to display an error message
    const displayError = (message) => {
        errorMessagebox.textContent = message;
        errorMessagebox.classList.remove('d-none'); // Show error box
        loadingMessageBox.classList.add('d-none'); // Hide loading box
        productsTable.classList.add('d-none');
        paginationContainer.classList.add('d-none');
        loadingSpinner.classList.add('d-none');
        messageBox.classList.add('d-none');
        noServiceMessageBox.classList.add('d-none');
    };
    // Function to display no service message
    const displayNoServiceMessage = () => {
        noServiceMessageBox.classList.remove('d-none'); // Show No Service box
        errorMessagebox.classList.add('d-none'); // Hide error box
        loadingMessageBox.classList.add('d-none'); // Hide loading box
        productsTable.classList.add('d-none');
        paginationContainer.classList.add('d-none');
        loadingSpinner.classList.add('d-none');
        messageBox.classList.add('d-none');
    };

    // Function to display the loading message and spinner
    const showLoading = () => {
        errorMessagebox.classList.add('d-none'); // Hide error box
        noServiceMessageBox.classList.add('d-none'); // Hide No Service box
        loadingMessageBox.classList.remove('d-none'); // Show loading box
        productsTable.classList.add('d-none');
        paginationContainer.classList.add('d-none');
        loadingSpinner.classList.remove('d-none'); // Show the spinner
        messageBox.classList.add('d-none');
    };

    // Function to display products in the table
    const displayProducts = (products) => {
        loadingMessageBox.classList.add('d-none'); // Hide loading message
        loadingSpinner.classList.add('d-none'); // Hide the spinner
        errorMessagebox.classList.add('d-none'); // Hide error message
        noServiceMessageBox.classList.add('d-none');
        productsTableBody.innerHTML = '';
        if (products.length === 0) {
            messageBox.classList.remove('d-none'); // Show no products message
            productsTable.classList.add('d-none');
            paginationContainer.classList.add('d-none');
        } else {
            messageBox.classList.add('d-none'); // Hide no products message
            productsTable.classList.remove('d-none');
            paginationContainer.classList.remove('d-none');
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.stock}</td>
                    <td>$${product.price}</td>
                    <td><button class="btn btn-danger delete-btn" data-product-id="${product.id}">Delete</button></td>
                `;
                productsTableBody.appendChild(row);
            });
            addDeleteEventListeners(); // Add event listeners to delete buttons
        }
    };
    // Function to add delete event listeners
    const addDeleteEventListeners = () => {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-product-id');
                const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
                document.getElementById('confirmDeleteButton').onclick = () => {
                    deleteProductFromList(productId);
                    modal.hide();
                };
                modal.show();
            });
        });
    };

    // Function to delete a product from the list
    const deleteProductFromList = (productId) => {
        try {
            deleteProduct(productId); // Delete the product using the service
            fetchProducts(); // Refresh the product list
        } catch (error) {
            displayError('Error deleting the product.');
        }
    };

    // Function to fetch products with pagination
    const fetchProducts = (page = 1) => {
        showLoading();
        try {
            const products = getAllProducts();
            // Calculate start and end indexes for pagination
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            // Get the paginated products
            const paginatedProducts = products.slice(startIndex, endIndex);
            displayProducts(paginatedProducts);
            setupPagination(products.length, page);
        } catch (error) {
            console.error('Error loading products:', error);
            displayError('An error occurred while loading the product list.');
        }
    };
    // Function to setup pagination links
    const setupPagination = (totalProducts, currentPage) => {
        const totalPages = Math.ceil(totalProducts / perPage);
        pagination.innerHTML = ""; // Clear existing pagination links

        // Previous Page
        const previousLi = document.createElement('li');
        previousLi.classList.add('page-item');
        const previousLink = document.createElement('a');
        previousLink.classList.add('page-link');
        previousLink.href = '#';
        previousLink.textContent = 'Previous';
        previousLi.appendChild(previousLink);
        pagination.appendChild(previousLi);

        previousLink.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchProducts(currentPage);
            }
        });

        // Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === currentPage) {
                li.classList.add('active');
            }
            const a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.textContent = i;
            a.addEventListener('click', () => {
                currentPage = i;
                fetchProducts(currentPage);
            });
            li.appendChild(a);
            pagination.appendChild(li);
        }
        // Next Page
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        const nextLink = document.createElement('a');
        nextLink.classList.add('page-link');
        nextLink.href = '#';
        nextLink.textContent = 'Next';
        nextLi.appendChild(nextLink);
        pagination.appendChild(nextLi);

        nextLink.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchProducts(currentPage);
            }
        });
        // Disable "Previous" button on first page
        if (currentPage === 1) {
            previousLink.classList.add('disabled');
            previousLi.classList.add('disabled');
        } else {
            previousLink.classList.remove('disabled');
            previousLi.classList.remove('disabled');
        }

        // Disable "Next" button on last page
        if (currentPage === totalPages && currentPage!=0) {
            nextLink.classList.add('disabled');
            nextLi.classList.add('disabled');
        } else {
            nextLink.classList.remove('disabled');
            nextLi.classList.remove('disabled');
        }
        if(totalPages == 0) {
            nextLink.classList.add('disabled');
            nextLi.classList.add('disabled');
            previousLink.classList.add('disabled');
            previousLi.classList.add('disabled');
        }
    };
    fetchProducts();
});