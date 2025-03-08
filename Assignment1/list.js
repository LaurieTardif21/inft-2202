//import section
import { getProducts, deleteProduct } from './product.service.js';

// const section
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

// pagination
let currentPage = 1;
const productsPerPage = 8;

// show message box function
function showMessageBox(message) {
    messageBox.textContent = message;
    messageBox.classList.remove('d-none');
    productsList.classList.add('d-none');
}

//loading message
function showLoadingMessage() {
    loadingMessageBox.classList.remove('d-none');
    productsList.classList.add('d-none');
}

// hide message
function hideMessages() {
    messageBox.classList.add('d-none');
    loadingMessageBox.classList.add('d-none');
    errorMessage.classList.add('d-none');
    noServiceMessage.classList.add('d-none');
    loadingPaginationMessageBox.classList.add('d-none');
}
//display errors
function displayError(error) {
    hideMessages();
    errorMessage.textContent = error;
    errorMessage.classList.remove('d-none');
}
// display no service
function displayNoService() {
    hideMessages();
    noServiceMessage.classList.remove('d-none');
}
//loading pagination
function showLoadingPagination() {
    hideMessages();
    loadingPaginationMessageBox.classList.remove('d-none');
    paginationContainer.classList.add('d-none');
}

// Function to create a product card
function createProductCard(product) {
    // ADDED: Log the product object to the console
    console.log({
        "name": product.name,
        "description": product.description,
        "stock": product.stock,
        "price": product.price
    });
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    // Card Image
    const img = document.createElement('img');
    img.src = 'https://via.placeholder.com/300x200?text=Product'; // Placeholder image
    img.classList.add('card-img-top');
    img.alt = product.name;
    card.appendChild(img);

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Product Name
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = product.name;
    cardBody.appendChild(title);

    // Product Description
    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = `Description: ${product.description}`;
    cardBody.appendChild(description);

    // Product Stock
    const stock = document.createElement('p');
    stock.classList.add('card-text');
    stock.textContent = `Stock: ${product.stock}`;
    cardBody.appendChild(stock);

    // Product Price
    const price = document.createElement('p');
    price.classList.add('card-text');
    price.textContent = `Price: $${product.price.toFixed(2)}`;
    cardBody.appendChild(price);

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('gap-2');
    // Edit Button
    const editButton = document.createElement('a');
    const compositeId = `${product.name}-${product.createTime}`;// add composite ID
    editButton.href = `product.html?id=${product.createTime}`;
    editButton.classList.add('btn', 'btn-primary');
    editButton.setAttribute('data-bs-toggle', 'tooltip');
    editButton.setAttribute('title', 'Edit');
    editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Font Awesome icon
    buttonsContainer.appendChild(editButton);

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.setAttribute('data-bs-toggle', 'tooltip');
    deleteButton.setAttribute('title', 'Delete');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome icon
    deleteButton.addEventListener('click', () => openDeleteModal(product.id));
    buttonsContainer.appendChild(deleteButton);

    // Add to cart Button
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('btn', 'btn-success');
    addToCartButton.setAttribute('data-bs-toggle', 'tooltip');
    addToCartButton.setAttribute('title', 'Add to Cart');
    addToCartButton.innerHTML = '<i class="fas fa-cart-plus"></i>'; // Font Awesome icon
    buttonsContainer.appendChild(addToCartButton);

    cardBody.appendChild(buttonsContainer);
    card.appendChild(cardBody);
    return card;
}
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
function updatePagination(totalPages, currentPage) {
    pagination.innerHTML = ''; // Clear existing pagination

    // Previous page button
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    prevLi.id = 'previousPage';
    const prevLink = document.createElement('a');
    prevLink.classList.add('page-link');
    prevLink.href = '#';
    prevLink.textContent = 'Previous';
    prevLi.appendChild(prevLink);
    pagination.appendChild(prevLi);

    // Handle Previous button click
    prevLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadProducts(currentPage);
        }
    });

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.classList.add('page-item');
        if (i === currentPage) {
            pageLi.classList.add('active');
        }
        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLi.appendChild(pageLink);
        pagination.appendChild(pageLi);

        // Handle page number click
        pageLink.addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = i;
            loadProducts(currentPage);
        });
    }

    // Next page button
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    nextLi.id = 'nextPage';
    const nextLink = document.createElement('a');
    nextLink.classList.add('page-link');
    nextLink.href = '#';
    nextLink.textContent = 'Next';
    nextLi.appendChild(nextLink);
    pagination.appendChild(nextLi);

    // Handle Next button click
    nextLink.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            loadProducts(currentPage);
        }
    });

    // Disable/Enable previous and next buttons based on current page
    prevLi.classList.toggle('disabled', currentPage === 1);
    nextLi.classList.toggle('disabled', currentPage === totalPages);
}

async function loadProducts(page) {
    hideMessages();
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
                loadingMessageBox.classList.add('d-none'); // Add this line
                loadingPaginationMessageBox.classList.add('d-none');// Add this line
                paginationContainer.classList.add('d-none');
            } else {
                const totalPages = Math.ceil(response.length / productsPerPage);
                if (totalPages === 1) {
                    paginationContainer.classList.add('d-none');
                } else {
                    paginationContainer.classList.remove('d-none');
                }
                hideMessages();
                productsList.innerHTML = ''; // Clear existing products
                paginatedProducts.forEach(product => {
                    const card = createProductCard(product);
                    productsList.appendChild(card);
                });
                productsList.classList.remove('d-none');
                
                updatePagination(totalPages, page);
                enableTooltips();// moved here
            }

        } else {
            displayNoService();
        }

    } catch (error) {
        displayError(`Error loading products: ${error.message}`);
    }
}
// Function to enable tooltips
function enableTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

loadProducts(currentPage);