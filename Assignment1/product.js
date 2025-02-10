// Name: Laurie Tardif
// Date: 02/09/2025
// Filename: product.js
// Course: INFT 2202
// Description: JavaScript file handling product addition and editing.

import { addProduct, findProduct, updateProduct } from './product.service.js';

// Wait for the DOM to be fully loaded before executing script
document.addEventListener('DOMContentLoaded', () => {
    // Selecting form and button elements
    const form = document.getElementById('product-form');
    const saveButton = form.querySelector('button[type="submit"]');
    const pageTitle = document.querySelector('h1.display-4');
    
    // Selecting input fields
    const nameInput = document.getElementById('product-name');
    const descriptionInput = document.getElementById('product-description');
    const stockInput = document.getElementById('product-stock');
    const priceInput = document.getElementById('product-price');
    
    // Selecting error message elements
    const nameError = document.getElementById('nameError');
    const descriptionError = document.getElementById('descriptionError');
    const stockError = document.getElementById('stockError');
    const priceError = document.getElementById('priceError');

    // Retrieve the product ID from the URL to determine if editing an existing product
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    /**
     * Helper function to validate if a value is a non-negative number
     * @param {string} value - The input value
     * @returns {boolean} True if valid, false otherwise
     */
    function isValidNonNegativeNumber(value) {
        const num = Number(value);
        return !isNaN(num) && num >= 0;
    }

    /**
     * Clears all error messages and resets validation styles
     */
    function clearErrors() {
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
    }

    /**
     * Displays an error message for an invalid input field
     * @param {HTMLElement} input - The input field
     * @param {HTMLElement} errorElement - The corresponding error message element
     * @param {string} message - The error message
     */
    function displayError(input, errorElement, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    /**
     * Marks an input field as valid
     * @param {HTMLElement} input - The input field
     */
    function setValid(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.nextElementSibling.style.display = 'none';
    }

    /**
     * Validates an input field based on a custom validation function
     * @param {HTMLElement} input - The input field
     * @param {HTMLElement} errorElement - The corresponding error message element
     * @param {Function} validationFunction - Function to validate the input
     * @param {string} errorMessage - The error message to display
     * @returns {boolean} True if valid, false otherwise
     */
    function validateField(input, errorElement, validationFunction, errorMessage) {
        const value = input.value.trim();
        if (!value || !validationFunction(value)) {
            displayError(input, errorElement, errorMessage);
            return false;
        } else {
            setValid(input);
            return true;
        }
    }

    /**
     * Fills the form with existing product data if in edit mode
     */
    async function fillForm() {
        pageTitle.textContent = 'Edit Product';
        saveButton.textContent = 'Update';
        nameInput.disabled = true; // Prevent changing the product name
        try {
            const product = await findProduct(productId);
            nameInput.value = product.name;
            descriptionInput.value = product.description;
            stockInput.value = product.stock;
            priceInput.value = product.price;
            setValid(nameInput);
            setValid(descriptionInput);
            setValid(stockInput);
            setValid(priceInput);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    // Determine whether adding a new product or editing an existing one
    if (productId) {
        fillForm();
    } else {
        pageTitle.textContent = 'Add Product';
        saveButton.textContent = 'Add Product';
        nameInput.disabled = false;
    }

    /**
     * Handles form submission to add or update a product
     */
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors();
        
        let isValid = true;

        // Validate input fields
        if (!validateField(nameInput, nameError, (value) => value !== '', 'Name is required.')) isValid = false;
        if (!validateField(descriptionInput, descriptionError, (value) => value !== '', 'Description is required.')) isValid = false;
        if (!validateField(stockInput, stockError, isValidNonNegativeNumber, 'Stock must be a non-negative number.')) isValid = false;
        if (!validateField(priceInput, priceError, isValidNonNegativeNumber, 'Price must be a non-negative number.')) isValid = false;
        
        if (!isValid) return;
        
        const product = {
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim(),
            stock: parseInt(stockInput.value.trim()),
            price: parseFloat(priceInput.value.trim()),
        };
        
        try {
            if (productId) {
                product.id = productId;
                await updateProduct(product);
            } else {
                await addProduct(product);
            }
            window.location.href = 'list.html'; // Redirect to product list
        } catch (error) {
            console.error('Error adding/updating product:', error);
            alert('Failed to add/update product. Please try again.');
        }
    });

    // Attach input validation handlers
    nameInput.addEventListener('input', () => validateField(nameInput, nameError, (value) => value !== '', 'Name is required.'));
    descriptionInput.addEventListener('input', () => validateField(descriptionInput, descriptionError, (value) => value !== '', 'Description is required.'));
    stockInput.addEventListener('input', () => validateField(stockInput, stockError, isValidNonNegativeNumber, 'Stock must be a non-negative number.'));
    priceInput.addEventListener('input', () => validateField(priceInput, priceError, isValidNonNegativeNumber, 'Price must be a non-negative number.'));
});
