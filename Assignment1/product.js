import { addProduct, findProduct, updateProduct } from './products/product.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const saveButton = form.querySelector('button[type="submit"]');
    // Inputs
    const productNameInput = document.getElementById('product-name');
    const categoryInput = document.getElementById('product-category');
    const priceInput = document.getElementById('product-price');
    const quantityInput = document.getElementById('product-quantity');
    const descriptionInput = document.getElementById('product-description');
    // Errors
    const categoryError = document.getElementById('categoryError');
    const priceError = document.getElementById('priceError');
    const quantityError = document.getElementById('quantityError');
    const descriptionError = document.getElementById('descriptionError');
    // Check if we're editing or adding
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Helper function to validate if an input is a non-negative number
    function isValidNonNegativeNumber(value) {
        const num = Number(value);
        if (isNaN(num) || num < 0) {
            throw new Error('Input must be a non-negative number.');
        }
        return true; // Indicate validation passed
    }

    // Helper function to clear all errors
    function clearErrors() {
        categoryError.textContent = '';
        priceError.textContent = '';
        quantityError.textContent = '';
        descriptionError.textContent = '';
    }

    // Function to fill the form
    async function fillForm() {
        // Editing a product
        saveButton.textContent = 'Save Product'; // Change button text
        productNameInput.disabled = true; // Disable name input in edit mode
        try {
            const product = await findProduct(productId);
            // Pre-fill the form
            productNameInput.value = product.productName;
            categoryInput.value = product.category;
            priceInput.value = product.price;
            quantityInput.value = product.quantity;
            descriptionInput.value = product.description;
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Failed to fetch product data. Please try again.');
        }
    }

    if (productId) {
        fillForm();
    } else {
        // Adding a new product
        saveButton.textContent = 'Add Product'; // Change button text
        productNameInput.disabled = false; // Enable name input in add mode (optional)
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        clearErrors(); // Reset error messages

        // Get the values from the form, and remove white spaces
        const productName = productNameInput.value.trim();
        const category = categoryInput.value.trim();
        const price = priceInput.value.trim();
        const quantity = quantityInput.value.trim();
        const description = descriptionInput.value.trim();

        // Validation
        try {
            if (!category) {
                throw new Error('Category is required.');
            }
            isValidNonNegativeNumber(price);
            isValidNonNegativeNumber(quantity);
            if (!description) {
                throw new Error('Description is required.');
            }
        } catch (error) {
            // Error handling
            if (error.message === 'Category is required.') {
                categoryError.textContent = error.message;
            } else if (error.message === 'Input must be a non-negative number.') {
                priceError.textContent = (priceError.textContent) ? priceError.textContent : error.message;
                quantityError.textContent = (quantityError.textContent) ? quantityError.textContent : error.message;
            } else if (error.message === 'Description is required.') {
                descriptionError.textContent = error.message;
            }
            return;
        }

        // Create the product object
        const product = {
            productName: productName,
            category: category,
            price: parseFloat(price), // convert to float, this is a good practice
            quantity: parseInt(quantity), // convert to int, this is a good practice
            description: description,
        };

        try {
            if (productId) {
                // If editing, add the id to the product object
                product.id = productId;
                // Call updateProduct
                await updateProduct(product);
            } else {
                // If adding, call addProduct
                await addProduct(product);
            }
            window.location.href = 'list.html'; // Redirect to list page
        } catch (error) {
            console.error('Error adding/updating product:', error);
            alert('Failed to add/update product. Please try again.');
        }
    });
});