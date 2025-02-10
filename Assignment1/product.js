import { getProduct, saveProduct } from './product.service.js';
const form = document.getElementById('product-form');
const productName = document.getElementById('product-name');
const productDescription = document.getElementById('product-description');
const productStock = document.getElementById('product-stock');
const productPrice = document.getElementById('product-price');
const breedError = document.getElementById('breedError');
const eyesError = document.getElementById('eyesError');
const legsError = document.getElementById('legsError');
const nameError = document.getElementById('nameError');
let id = null;
// Retrieve the product ID from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
id = urlParams.get('id');

// Load product data if ID is present
async function loadProduct() {
    if (id) {
        try {
            const product = await getProduct(id);
            if (product) {
                productName.value = product.name;
                productDescription.value = product.description;
                productStock.value = product.stock;
                productPrice.value = product.price;
            } else {
                displayError('Product not found!');
            }
        } catch (error) {
            displayError('Error loading product details.');
        }
    }
}
function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

// Load product details when the page loads
loadProduct();

// Event listener for form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Reset error messages and input styles
    breedError.textContent = '';
    eyesError.textContent = '';
    legsError.textContent = '';
    nameError.textContent = '';
    productName.classList.remove('is-invalid', 'is-valid');
    productDescription.classList.remove('is-invalid', 'is-valid');
    productStock.classList.remove('is-invalid', 'is-valid');
    productPrice.classList.remove('is-invalid', 'is-valid');
    
    let isValid = true;

    // Validate product name
    if (!productName.value.trim()) {
        isValid = false;
        nameError.textContent = 'Product name is required.';
        productName.classList.add('is-invalid');
    } else {
        productName.classList.add('is-valid');
    }
    // Validate product description
    if (!productDescription.value.trim()) {
        isValid = false;
        breedError.textContent = 'Product description is required.';
        productDescription.classList.add('is-invalid');
    } else {
        productDescription.classList.add('is-valid');
    }

    // Validate product stock
    if (productStock.value <= 0) {
        isValid = false;
        eyesError.textContent = 'Product stock must be greater than 0.';
        productStock.classList.add('is-invalid');
    } else {
        productStock.classList.add('is-valid');
    }
    
    // Validate product price
    if (productPrice.value < 0) {
        isValid = false;
        legsError.textContent = 'Product price cannot be negative.';
        productPrice.classList.add('is-invalid');
    } else {
        productPrice.classList.add('is-valid');
    }
    // If any validation failed, prevent form submission
    if (!isValid) {
        return;
    }
    
    // Create the product object
    const product = {
        name: productName.value,
        description: productDescription.value,
        stock: parseInt(productStock.value),
        price: parseFloat(productPrice.value)
    };

    // Save the product
    try {
        const savedProduct = await saveProduct(product, id);

        // If there is an ID, we are editing a product
        if (id) {
            // Redirect to the list page
            window.location.href = 'list.html';
        } else {
            // Clear the form
            form.reset();
            productName.focus();
            alert('Product added successfully!');
        }
    } catch (error) {
        displayError(`Failed to save product: ${error.message}`);
    }
});