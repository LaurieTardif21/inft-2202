import { addProduct, findProduct, updateProduct } from './product.service.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const saveButton = form.querySelector('button[type="submit"]');
    // Inputs
    const nameInput = document.getElementById('product-name');
    const breedInput = document.getElementById('product-description');
    const eyesInput = document.getElementById('product-stock');
    const legsInput = document.getElementById('product-price');
    // Errors
    const descriptionError = document.getElementById('descriptionError');
    const stockError = document.getElementById('stockError');
    const priceError = document.getElementById('priceError');
    
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
        descriptionError.textContent = '';
        stockError.textContent = '';
        priceError.textContent = '';
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
        const stock = stocInput.value.trim();
        const price = priceInput.value.trim();

        // Validation
        try {
            if (!description) {
                throw new Error('Description is required.');
            }
            isValidNonNegativeNumber(stock);
            isValidNonNegativeNumber(price);
        } catch (error) {
            //Error handling
            if (error.message === 'Breed is required.') {
                breedError.textContent = error.message;
            } else if (error.message === 'Input must be a non-negative number.') {
                eyesError.textContent = (eyesError.textContent)?eyesError.textContent: error.message;
                legsError.textContent = (legsError.textContent)?legsError.textContent: error.message;
            }else if (error.message === 'Sound is required.') {
                soundError.textContent = error.message;
            }
            return;
        }
        // Create the animal object
        const animal = {
            name: name,
            breed: breed,
            eyes: parseInt(eyes), // convert to an int, this is a good practice
            legs: parseInt(legs), // convert to an int, this is a good practice
            sound: sound,
        };

        try{
            if (animalId) {
                // If editing, add the id to the animal object
                animal.id = animalId;
                 // Call updateAnimal
                await updateAnimal(animal);
            } else {
                // If adding, call addAnimal
                await addAnimal(animal);
            }
            window.location.href = 'list.html'; // Redirect to list page
        }catch(error){
            console.error('Error adding/updating animal:', error);
            alert('Failed to add/update animal. Please try again.');
        }
    });
});