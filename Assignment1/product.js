// name: laurie tardif
// date: 02/09/2025
// filename: product.js
// course: inft 2202
// description: product functions

//import section
import { addProduct, findProduct, updateProduct } from './product.service.js';

// event listeners
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const saveButton = form.querySelector('button[type="submit"]');
    const pageTitle = document.querySelector('h1.display-4');
    // Inputs
    const nameInput = document.getElementById('product-name');
    const descriptionInput = document.getElementById('product-description');
    const stockInput = document.getElementById('product-stock');
    const priceInput = document.getElementById('product-price');
    // Errors
    const nameError = document.getElementById('nameError');
    const descriptionError = document.getElementById('descriptionError');
    const stockError = document.getElementById('stockError');
    const priceError = document.getElementById('priceError');

    // Check if we're editing or adding
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Helper function to validate if an input is a non-negative number
    function isValidNonNegativeNumber(value) {
        const num = Number(value);
        return  !isNaN(num) && num >= 0;
    }
    // Helper function to validate if an input is a valid stock
    function isValidStock(value) {
        const num = Number(value);
        return !isNaN(num) && Number.isInteger(num) && num >= 1;
    }

    // Helper function to clear all errors
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
    // function to hide errors
        function hideError(input, errorElement) {
        input.classList.remove('is-invalid');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    // function to display errors
    function displayError(input, errorElement, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // function to set validation
    function setValid(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    // function to validate
    function validateField(input, errorElement, validationFunction, errorMessage) {
        const value = input.value.trim();
        if (value === '') {
            displayError(input, errorElement, errorMessage);
            return false;
        } else if (!validationFunction(value)) {
            displayError(input, errorElement, errorMessage);
            return false;
        }
        else {
            hideError(input, errorElement)
            setValid(input);
            return true;
        }
    }

    // Function to fill the form
    async function fillForm() {
        // Editing a product
        pageTitle.textContent = 'Edit Product'; // Change page title to Edit Product
        saveButton.textContent = 'Update'; // Change button text to Update
        nameInput.disabled = true; // Disable name input in edit mode
        try {
            const product = await findProduct(productId);
            // Pre-fill the form
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

    if (productId) {
        fillForm();
    } else {
        // Adding a new product
        pageTitle.textContent = 'Add Product'; // Change page title to Add Product
        saveButton.textContent = 'Add Product';
        nameInput.disabled = false;
    }

    // event listener for submit
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors();

        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const stock = stockInput.value.trim();
        const price = priceInput.value.trim();
        let isValid = true;

        // ensure form is filled out
        if (!validateField(nameInput, nameError, (value) => value !== '', 'Name is required.')) {
            isValid = false;
        }

        if (!validateField(descriptionInput, descriptionError, (value) => value !== '', 'Description is required.')) {
            isValid = false;
        }
        if (!validateField(stockInput, stockError, isValidStock, 'Stock must be at least 1.')) {
            isValid = false;
        }
        if (!validateField(priceInput, priceError, isValidNonNegativeNumber, 'Price must be a non-negative number.')) {
            isValid = false;
        }
        if (!isValid) {
            return;
        }

        const product = {
            name: name,
            description: description,
            stock: parseInt(stock),
            price: parseFloat(price),
        };

        try {
            if (productId) {
                product.id = productId;
                await updateProduct(product);
            } else {
                await addProduct(product);
            }
            window.location.href = 'list.html';
        } catch (error) {
            console.error('Error adding/updating product:', error);
            alert('Failed to add/update product. Please try again.');
        }
    });

     // event listeners for the input
    nameInput.addEventListener('input', () => {
        validateField(nameInput, nameError, (value) => value !== '', 'Name is required.');
    });

    descriptionInput.addEventListener('input', () => {
        validateField(descriptionInput, descriptionError, (value) => value !== '', 'Description is required.');
    });

    stockInput.addEventListener('input', () => {
        validateField(stockInput, stockError, isValidStock, 'Stock must be at least 1.');
    });

    priceInput.addEventListener('input', () => {
        validateField(priceInput, priceError, isValidNonNegativeNumber, 'Price must be a non-negative number.');
    });
});