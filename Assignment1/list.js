// name: laurie tardif
// date: 02/09/2025
// filename: list.js
// course: inft 2202
// description: list functions

// Import section
import { getProducts, deleteProduct, getProductPage } from './product.service.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productsList = document.getElementById('products-list');
    const messageBox = document.getElementById('message-box');
    const loadingMessageBox = document.getElementById('loading-message-box');
    const errorMessagebox = document.getElementById('error-message-box');
    const noServiceMessagebox = document.getElementById('no-service-message-box');
    const loadingPaginationMessageBox = document.getElementById('loading-pagination-message-box');
    const paginationContainer = document.getElementById('paginationContainer');
    const pagination = document.getElementById('pagination');
    const previousPage = document.getElementById('previousPage');
    const nextPage = document.getElementById('nextPage');
    let currentPage = 1; // Initialize the current page
    let perPage = 5; // Initialize the per page value
    let totalPages; // Initialize the totalPages

    // function to delete the product
    const deleteProductHandler = async (productId) => {
        try {
            await deleteProduct(productId);
            // Remove product from the DOM
            const productElement = document.querySelector(`[data-id="${productId}"]`);
            if (productElement) {
                productElement.remove();
            }

            // refresh the list of products
            await showProducts(currentPage, perPage);
        } catch (error) {
            console.error('Error deleting product:', error);
            errorMessagebox.textContent = 'Error deleting product. Please try again.';
            errorMessagebox.classList.remove('d-none');
        }
    };

    // function to show the products
    const showProducts = async (page, perPage) => {
        // show loading
        productsList.classList.add('d-none');
        loadingMessageBox.classList.remove('d-none');
        errorMessagebox.classList.add('d-none');
        noServiceMessagebox.classList.add('d-none');
        // hide pagination
        paginationContainer.classList.add('d-none');

        // Clear previous products
        productsList.innerHTML = '';
        // hide message
        messageBox.classList.add('d-none');
        try {
            // Get the products
            const productsData = await getProductPage(page, perPage);
            // Get the products and pagination information
            const products = productsData.records;
            totalPages = productsData.pagination.pages;

            // if there is no product, show message
            if (products.length === 0) {
                messageBox.classList.remove('d-none');
            } else {
                // if there is products, hide message
                messageBox.classList.add('d-none');
                // Display the products
                products.forEach(product => {
                    // get id
                    const productId = `${product.name}-${product.createTime}`;
                    // Create the card
                    const productCard = document.createElement('div');
                    productCard.classList.add('card');
                    productCard.setAttribute('data-id', productId); // set id
                    productCard.innerHTML = `
                        <img src="https://picsum.photos/200/200" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">Stock: ${product.stock}</p>
                            <p class="card-text">Price: ${product.price}</p>
                            <div class="d-flex justify-content-around mt-3">
                                <a href="product.html?id=${productId}" class="btn btn-primary">Edit</a>
                                <button class="btn btn-danger delete-button">Delete</button>
                            </div>
                        </div>
                    `;
                    productsList.appendChild(productCard);
                });
            }
            // hide loading
            loadingMessageBox.classList.add('d-none');
            productsList.classList.remove('d-none');
            //Show pagination
            paginationContainer.classList.remove('d-none');
            // Update pagination
            updatePagination();
        } catch (error) {
            console.error('Error fetching products:', error);
            errorMessagebox.textContent = 'Error fetching products. Please try again.';
            errorMessagebox.classList.remove('d-none');
            // hide loading
            loadingMessageBox.classList.add('d-none');
        }
    };

    // event listener for the delete button
    productsList.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-button');
        if (deleteButton) {
            const productCard = deleteButton.closest('.card');
            const productId = productCard.getAttribute('data-id');
            // Show the confirmation modal
            const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
            deleteConfirmationModal.show();

            // Attach the delete event listener to the confirm button
            const confirmDeleteButton = document.getElementById('confirmDeleteButton');
            confirmDeleteButton.onclick = async () => {
                await deleteProductHandler(productId);
                // Hide the modal
                deleteConfirmationModal.hide();
            };
        }
    });

    // Function to update the pagination UI
    function updatePagination() {
        // Clear existing page links
        pagination.querySelectorAll('.page-item:not(#previousPage):not(#nextPage)').forEach(item => item.remove());

        // Add new page links
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            if (i === currentPage) {
                pageItem.classList.add('active');
            }

            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.addEventListener('click', (event) => {
                event.preventDefault();
                currentPage = i;
                showProducts(currentPage, perPage);
            });

            pageItem.appendChild(pageLink);
            pagination.insertBefore(pageItem, nextPage);
        }

        // Update "Previous" button state
        previousPage.classList.toggle('disabled', currentPage === 1);
        // Update "Next" button state
        nextPage.classList.toggle('disabled', currentPage === totalPages);
    }

    // Previous page event listener
    previousPage.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            showProducts(currentPage, perPage);
        }
    });

    // Next page event listener
    nextPage.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            showProducts(currentPage, perPage);
        }
    });

    // Load the first page of products
    await showProducts(currentPage, perPage);
});