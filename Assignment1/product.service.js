// name: laurie tardif
// date: 02/09/2025
// filename: product.service.js
// course: inft 2202
// description: product service functions

const API_KEY = '1|inft2202-2024|tardif';
const API_URL = 'https://inft2202-server.onrender.com/api/products';

// Common headers for API requests
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};

// Function to add a product
export async function addProduct(product) {
    try {
        console.log('Adding Product:', product);
        const payload = [product]; // Wrap the product in an array
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload) // Send the array as the body
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Error Response:', errorMessage);
            throw new Error(`Failed to add product: ${errorMessage}`);
        }
        const data = await response.json();
        console.log('Product added:', data);
        return data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error(`Error adding product: ${error.message}`);
    }
}

// Function to get a product by id
export async function getProduct(createTime) {
    if (!createTime) throw new Error(`Error getting product: create time must be set.`);
    try {
        const response = await fetch(`${API_URL}/${createTime}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Error Response:', errorMessage);
            throw new Error(`Failed to get product: ${errorMessage}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error getting product:`, error);
        throw new Error(`Error getting product: ${error}`);
    }
}
// Function to update a product
export async function updateProduct(product) {
    if (!product || !product.createTime) throw new Error(`Error updating product: Product or createTime not set.`);
    try {
        const response = await fetch(`${API_URL}/${product.createTime}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Error Response:', errorMessage);
            throw new Error(`Failed to update product: ${errorMessage}`);
        }
        const data = await response.json();
        console.log('Product updated:', data);
        return data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error(`Error updating product: ${error}`);
    }
}

// Function to get paginated products
export async function getProductPage(page, perPage) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&perPage=${perPage}`, { headers });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch products: ${errorMessage}`);
}

        const totalRecords = response.headers.get("X-Total-Count");
        const totalPages = Math.ceil(totalRecords / perPage);
        const data = await response.json();

        return {
            records: data.records,
            pagination: {
                pages: totalPages,
                page: page,
                perPage: perPage
            }
        };
    } catch (error) {
        throw new Error(`Error getting products: ${error.message}`);
    }
}

// Function to get all products
export async function getProducts() {
    try {
        const response = await fetch(API_URL, { headers });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch products: ${errorMessage}`);
        }
        const data = await response.json();
        return data.records;
    } catch (error) {
        throw new Error(`Error getting products: ${error.message}`);
    }
}

// Function to delete a product by createTime
export async function deleteProduct(createTime) {
    try {
        const response = await fetch(`${API_URL}/${createTime}`, {
            method: "DELETE",
            headers
        });

        if (!response.ok) throw new Error("Failed to delete product");

        return;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}