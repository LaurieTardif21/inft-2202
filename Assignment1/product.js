import { addProduct, findProduct, updateProduct } from './product.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const saveButton = form.querySelector('button[type="submit"]');
    // Inputs
    const nameInput = document.getElementById('product-name');
    const descriptionInput = document.getElementById('product-description');
    const stockInput = document.getElementById('product-stock');
    const priceInput = document.getElementById('product-price');
    // Errors
    const descriptionError = document.getElementById('breedError'); //updated to match error location
    const stockError = document.getElementById('eyesError'); //updated to match error location
    const priceError = document.getElementById('legsError');//updated to match error location

    // Check if we're editing or adding
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Helper function to validate if an input is a non-negative number
    function isValidNonNegativeNumber(value) {
        const num = Number(value);
        if (isNaN(num) || num < 0) {
            return false;
        }
        return true; // Indicate validation passed
    }
 // Helper function to clear all errors
    function clearErrors() {
        const errorMessages = form.querySelectorAll('.error-message'); // Select all error messages
        errorMessages.forEach(error => {
            error.textContent = ''; // Clear the text content
            error.style.display = 'none'; // Hide the error message
        });
         const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
    }
        function displayError(input, errorElement, message) {
        input.classList.add('is-invalid');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function setValid(input){
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.nextElementSibling.style.display = 'none';
    }
    // Function to fill the form
    async function fillForm(){
          // Editing a product
          saveButton.textContent = 'Save Product'; // Change button text
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
             alert('Failed to fetch product data. Please try again.');
          }
    }
    
    if (productId) {
       fillForm();
    } else {
        // Adding a new product
        saveButton.textContent = 'Add Product'; //Change button text
        nameInput.disabled = false; // Enable name input in add mode (optional)
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        clearErrors();// Reset error messages

        // Get the values from the form, and remove white spaces
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const stock = stockInput.value.trim();
        const price = priceInput.value.trim();
        let isValid = true;
        // Validation
         // Validate Description
        if (description === '') {
            displayError(descriptionInput, descriptionError, 'Description is required.');
            isValid = false;
        } else {
            setValid(descriptionInput)
        }

        // Validate Stock
        if (!isValidNonNegativeNumber(stock)) {
             displayError(stockInput, stockError, 'Stock must be a non-negative number.');
            isValid = false;
        } else {
            setValid(stockInput)
        }

        // Validate Price
        if (!isValidNonNegativeNumber(price)) {
             displayError(priceInput, priceError, 'Price must be a non-negative number.');
             isValid = false;
        } else {
            setValid(priceInput)
        }
        if(!isValid){
            return
        }
        // Create the product object
        const product = {
            name: name,
            description: description,
            stock: parseInt(stock), // convert to an int, this is a good practice
            price: parseFloat(price), // convert to a float, this is a good practice
        };

        try{
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
        }catch(error){
            console.error('Error adding/updating product:', error);
            alert('Failed to add/update product. Please try again.');
        }
    });
});