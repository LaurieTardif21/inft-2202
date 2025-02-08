// Name: Laurie Tardif
// Date: 02/08/2025
// Course Code: INFT 2202
// Section Number: 05
// Description: Handles adding a new product to local storage and redirecting to the list page.

import ProductService from './product.service.js';

// Helper function to validate if an input is a non-negative number
function isValidNonNegativeNumber(value) {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
        throw new Error('Input must be a non-negative number.');
    }
    return true; // Indicate validation passed
}

 // Helper function to validate if an input is a non-negative number
 function isValidPrice(value) {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
         throw new Error('Price must be a non-negative number.');
    }
    if (Math.round(num*100)/100!=num) {
         throw new Error('Price has to have 2 decimal max.');
    }
    return true; // Indicate validation passed
}

 // Helper function to clear all errors
 function clearErrors(descriptionError, stockError, priceError) {
    descriptionError.textContent = '';
    stockError.textContent = '';
    priceError.textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const saveButton = form.querySelector('button[type="submit"]');
    // Inputs
    const nameInput = document.getElementById('productName');
    const descriptionInput = document.getElementById('productDescription');
    const stockInput = document.getElementById('productStock');
    const priceInput = document.getElementById('productPrice');
    // Errors
    const descriptionError = document.getElementById('descriptionError');
    const stockError = document.getElementById('stockError');
    const priceError = document.getElementById('priceError');
    // Check if we're editing or adding
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

        // Function to fill the form
        async function fillForm(){
             // Editing an product
             saveButton.textContent = 'Save Product'; // Change button text
             nameInput.disabled = true; // Disable name input in edit mode
             try {
               const product = await ProductService.findProduct(productId);
                // Pre-fill the form
                nameInput.value = product.name;
                descriptionInput.value = product.description;
                stockInput.value = product.stock;
                priceInput.value = product.price;
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
        clearErrors(descriptionError, stockError, priceError);// Reset error messages

        // Get the values from the form, and remove white spaces
        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();
        const stock = stockInput.value.trim();
        const price = priceInput.value.trim();

        // Validation
        try {
            if (!description) {
                throw new Error('Description is required.');
            }
            isValidNonNegativeNumber(stock);
            isValidPrice(price);
           
        } catch (error) {
            //Error handling
            if (error.message === 'Description is required.') {
                descriptionError.textContent = error.message;
            } else if (error.message === 'Input must be a non-negative number.') {
                stockError.textContent = (stockError.textContent)?stockError.textContent: error.message;
            } else if(error.message === 'Price must be a non-negative number.'){
                priceError.textContent = error.message;
            }
             else if(error.message === 'Price has to have 2 decimal max.'){
                priceError.textContent = error.message;
            }
            return;
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
                await ProductService.updateProduct(product);
            } else {
                // If adding, call addProduct
                await ProductService.addProduct(product);
            }
            window.location.href = 'list.html'; // Redirect to list page
        }catch(error){
            console.error('Error adding/updating product:', error);
            alert('Failed to add/update product. Please try again.');
        }
    });
});